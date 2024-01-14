import { get } from "../get"
import { mapValues } from "../map-values"
import { compileAll } from "./compiler"
import { loadDir } from "./loader"
import { Resource } from "./types"

type Primitive = string | number | bigint | boolean | null | undefined

export interface TOptions extends Record<string, Primitive> {
	lng?: string
}

let resources: Record<string, any>

export class I18n {
	readonly fallbackLng = "en"

	constructor(public lng: string | null = null) {}

	static async init(cwd: string) {
		resources ??= compileAll(await loadDir(cwd))
	}

	get languages() {
		return Object.keys(resources)
	}

	getResource(
		path: string | string[],
		opts: TOptions = {},
	): Resource | undefined {
		if (Array.isArray(path)) path = path.join(".")

		let lng = opts.lng ?? this.lng ?? this.fallbackLng
		if (!(lng in resources)) lng = this.fallbackLng

		const res = get(resources[lng], path)

		switch (typeof res) {
			case "undefined":
				return undefined
			case "function":
				return res(opts)
			case "object":
				return this.expand(res, opts)
			default:
				return String(res)
		}
	}

	t(path: string | string[], opts: TOptions = {}): string {
		if (Array.isArray(path)) path = path.join(".")

		const res = this.getResource(path, opts)
		if (typeof res === "string") return res

		let lng = opts.lng ?? this.lng ?? this.fallbackLng
		if (!(lng in resources)) lng = this.fallbackLng

		return `{${lng}:${path}:${typeof res}}`
	}

	private expand(res: any, opts: TOptions): any {
		if (typeof res === "function") return res(opts)
		if (Array.isArray(res)) return res.map((f) => f(opts))
		return mapValues(res, (x) => this.expand(x, opts))
	}
}

export const i18n = new I18n()
