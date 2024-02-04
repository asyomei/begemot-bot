import { get, isString, mapValues } from "lodash"
import { escapeHTML } from "../escape-html"
import { when } from "../misc"
import { compileAll } from "./compiler"
import { loadDir } from "./loader"
import { Resource } from "./types"

export type Lang = string | null | undefined
export type TOptions = Record<
	string,
	string | number | bigint | boolean | null | undefined
>

const resources = compileAll(loadDir("translations"))

export const fallbackLng = "en"
export const languages = Object.freeze(Object.keys(resources))

export function getI18nResource(
	lng: Lang,
	path: string | string[],
	opts: TOptions = {},
): Resource | undefined {
	opts = escapeOpts(opts)
	if (Array.isArray(path)) path = path.join(".")
	if (!(lng && lng in resources)) lng = fallbackLng

	const res = get(resources[lng], path)

	switch (typeof res) {
		case "undefined":
			return undefined
		case "function":
			return res(opts)
		case "object":
			return expand(res, opts)
		default:
			return String(res)
	}
}

export function tr(
	lng: Lang,
	path: string | string[],
	opts: TOptions = {},
): string {
	if (Array.isArray(path)) path = path.join(".")
	if (!(lng && lng in resources)) lng = fallbackLng

	const res = getI18nResource(lng, path, opts)
	if (typeof res === "string") return res

	return `{${lng}:${path}:${typeof res}}`
}

function expand(res: any, opts: TOptions): any {
	if (typeof res === "function") return res(opts)
	if (Array.isArray(res)) return res.map((f) => f(opts))
	return mapValues(res, (x) => expand(x, opts))
}

const escapeOpts = (opts: TOptions) =>
	mapValues(opts, when(isString, escapeHTML))

export class I18nNotFoundError extends Error {
	constructor(lng: Lang, path: string | string[], what = "resource") {
		lng ??= fallbackLng
		const key = Array.isArray(path) ? path.join(".") : path
		super(`Not found ${what} with key "${lng}:${key}"`)
	}
}
