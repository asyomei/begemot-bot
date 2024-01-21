import { CallbackQueryContext, MiddlewareFn } from "grammy"
import { MyContext } from "#/types/context"
import { Simplify } from "#/types/simplify"
import { tr } from "./i18n"
import { mapValues } from "./map-values"

type Id = string | number | bigint
type Schema = Record<string, (s: string) => any>
type From<S extends Schema> = Simplify<{
	[K in keyof S]: ReturnType<S[K]>
}>

const PAYLOAD_SEP = "/"
const ID_SEP = "~"
const DEL = "╎"

export class CallbackData<T extends "public" | "private", S extends Schema> {
	constructor(
		private id: string,
		type: T,
		private schema: S,
	) {
		const _ = type
	}

	pack(data: From<S>, ...ids: T extends "private" ? [ids: Id[]] : []): string {
		const id = ids.join(ID_SEP)

		const payload = Object.keys(this.schema)
			.map((k) => data[k])
			.join(PAYLOAD_SEP)

		return (id && id + DEL) + this.id + (payload && PAYLOAD_SEP + payload)
	}

	unpack(data: string): From<S> {
		const raws = data.split(DEL).at(-1)!.split(PAYLOAD_SEP).slice(1)
		const iter = raws[Symbol.iterator]()

		return mapValues(this.schema, (f) => f(iter.next().value)) as From<S>
	}

	filter(data: Partial<From<S>> = {}): RegExp {
		const payload = Object.keys(this.schema)
			.map((k) => data[k] ?? `([^${PAYLOAD_SEP}]*)`)
			.join(PAYLOAD_SEP)

		return new RegExp(`${this.id + (payload && PAYLOAD_SEP + payload)}$`)
	}

	private(): MiddlewareFn<CallbackQueryContext<MyContext>> {
		return async (ctx, next) => {
			const data = ctx.callbackQuery.data
			if (!data.includes(DEL)) return await next()

			const ids = data.split(DEL)[0]!.split(ID_SEP).map(Number)
			if (ids.some((id) => ctx.from.id === id)) return await next()

			await ctx.answerCallbackQuery(tr(ctx.lng, "common.wrong-button"))
		}
	}
}
