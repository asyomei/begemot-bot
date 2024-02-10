import { identity } from "lodash"
import { Simplify } from "#/types/simplify"
import { commandExample } from "./command-example"
import { Lang } from "./i18n"

type Schema = {
	[key: string]: [RegExp, (((s: string | undefined) => any) | null)?, string?]
}

type From<S extends Schema> = Simplify<{
	[K in keyof S]: S[K][1] extends (...args: any[]) => any
		? ReturnType<S[K][1]>
		: string | undefined
}>

export class CommandArgs<S extends Schema> {
	private args

	constructor(
		private commandKey: string,
		private schema: S,
	) {
		this.args = Object.values(this.schema).map((s) => s[2] ?? "__")
	}

	parse(match: string): From<S> | null {
		const data: any = {}

		for (const [key, [re, parse]] of Object.entries(this.schema)) {
			if (re.global) return null

			const m = match.match(re)
			if (!m) return null

			data[key] = (parse ?? identity)(m[1])
			if (m[1] != null && m.index != null) {
				match = remove(match, m.index, m[1].length).trim()
			}
		}

		return data
	}

	example(lng: Lang) {
		return commandExample(lng, this.commandKey, this.args)
	}
}

function remove(str: string, idx: number, len: number): string {
	return str.slice(0, idx) + str.slice(idx + len)
}
