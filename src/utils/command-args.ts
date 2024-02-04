import { Simplify } from "#/types/simplify"

type Schema = {
	[key: string]: [RegExp, (s: string | undefined) => any, string]
}

type From<S extends Schema> = Simplify<{
	[K in keyof S]: ReturnType<S[K][1]>
}>

export class CommandArgs<S extends Schema> {
	constructor(private schema: S) {}

	parse(match: string): From<S> | null {
		const data: any = {}

		for (const [key, [re, parse]] of Object.entries(this.schema)) {
			if (re.global) return null

			const m = match.match(re)
			if (!m) return null

			data[key] = parse(m?.[1])
			if (m?.[1] != null && m.index != null) {
				match = match.slice(0, m.index) + match.slice(m.index + m[1].length)
			}
		}

		return data
	}

	get exampleArgs() {
		return Object.values(this.schema).map((s) => s[2])
	}
}
