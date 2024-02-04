import { Filter } from "grammy"
import { isEqual, mapValues, negate, pick, size } from "lodash"
import { MyContext } from "#/types/context"
import { Simplify } from "#/types/simplify"

type Id = string | number | bigint

type Predicate = <C extends Filter<MyContext, "callback_query:data">>(
	ctx: C,
) => boolean | Promise<boolean>

type Schema = {
	[type: string]: {
		[key: string]: (s: string) => any
	}
	default: Schema[string]
}

type From<S extends Schema[string]> = Simplify<{
	[K in keyof S]: ReturnType<S[K]>
}>

const PAYLOAD_SEP = "/"
const ID_SEP = "~"
const DEL = "╎"

export class CallbackData<C extends "public" | "private", S extends Schema> {
	constructor(
		private name: string,
		private scope: C,
		private schema: S,
	) {}

	pack(
		data: From<S["default"]>,
		...ids: C extends "private" ? [ids: Id[]] : []
	): string
	pack<T extends keyof S>(
		type: T,
		data: From<S[T]>,
		...ids: C extends "private" ? [ids: Id[]] : []
	): string
	pack(...args: any[]): string {
		if (this.scope === "public") {
			const [type, data] = args.length === 2 ? args : ["default", args[0]]
			return this.packData(type, data)
		}

		const [type, data, ids] = args.length === 3 ? args : ["default", ...args]
		const cbData = this.packData(type, data)
		if (size(ids) === 0) return cbData
		return ids.join(ID_SEP) + DEL + cbData
	}

	unpack(data: string): From<S["default"]>
	unpack<T extends keyof S>(type: T, data: string): From<S[T]>
	unpack(...args: [string] | [string, string]): any {
		const [type, data] = args.length === 2 ? args : ["default", args[0]]
		const schema = this.schema[type]
		if (size(schema) === 0) return {}

		const raws = data.split(DEL).at(-1)!.split(PAYLOAD_SEP)
		const iter = raws.slice(1)[Symbol.iterator]()

		return mapValues(schema, (parse) => parse(iter.next().value))
	}

	filter(data?: From<S["default"]>): Predicate
	filter<T extends keyof S>(type: T, data?: From<S[T]>): Predicate
	filter(...args: any[]): Predicate {
		const [type, filterData] =
			args.length === 2
				? args
				: args.length === 0
				  ? ["default"]
				  : typeof args[0] === "string"
					  ? [args[0]]
					  : ["default", args[0]]
		const schema = this.schema[type] ?? {}

		return async (ctx) => {
			const parts = ctx.callbackQuery.data.split(DEL) as
				| [string]
				| [string, string]
			const [rawIds, cbData] = parts.length === 2 ? parts : ["", parts[0]]

			const [name, ...raws] = cbData.split(DEL).at(-1)!.split(PAYLOAD_SEP)
			if (name !== this.name) return false
			if (size(schema) !== raws.length) return false

			if (filterData) {
				const iter = raws[Symbol.iterator]()
				const data = mapValues(schema, (parse) => parse(iter.next().value))
				const pickData = pick(data, Object.keys(filterData))
				if (!isEqual(pickData, filterData)) return false
			}

			if (this.scope === "public") return true

			const ids = rawIds.split(ID_SEP).map(Number).filter(negate(Number.isNaN))
			if (ids.length === 0 || ids.includes(ctx.from.id)) return true

			await ctx.answerCallbackQuery(ctx.i18n.t("common.wrong-button"))
			return false
		}
	}

	private packData(type: string, data: any): string {
		const schema = this.schema[type]
		if (size(schema) === 0) return this.name

		const raws = Object.keys(schema!).map((key) => String(data[key]))
		return this.name + PAYLOAD_SEP + raws.join(PAYLOAD_SEP)
	}
}
