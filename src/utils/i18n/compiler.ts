import MessageFormat from "@messageformat/core"
import { flow, mapValues } from "lodash"
import { escapeHTML } from "../escape-html"
import { includesIn } from "../misc"
import { splitOnce } from "../split-once"
import { Resource } from "./types"

export function compileAll(
	resources: Record<string, Record<string, Resource>>,
) {
	return mapValues(resources, (res, lng) => {
		const mf = new MessageFormat(lng)

		const compile = flow(escapeMessage, (x) => mf.compile(x))
		return _compile(compile, res)
	})
}

function _compile(compile: (x: string) => any, res: Resource): any {
	if (typeof res === "string") return compile(res)
	if (Array.isArray(res)) return res.map(compile)
	return mapValues(res, (x) => _compile(compile, x))
}

function escapeMessage(s: string) {
	let [res, o] = ["", 0]

	for (let i = 0; i < s.length; i++) {
		if (s[i] !== "{") continue

		const idx = s.indexOf("}", i + 1)
		if (idx === -1) continue

		const [[...formats], text] = splitOnce(s.slice(i + 1, idx).trim(), /\s+/)
		if (!text || formats.length === 0) continue

		if (!formats.every(includesIn(Object.keys(allFormats)))) continue

		let fmtText = escapeHTML(text)
		for (const [fmt, [s, e = s]] of Object.entries(allFormats)) {
			if (formats.includes(fmt)) fmtText = `<${s}>${fmtText}</${e}>`
		}

		res += escapeHTML(s.slice(o, i)) + fmtText
		o = idx + 1
	}

	return res + escapeHTML(s.slice(o))
}

const allFormats = {
	"*": ["b"],
	"/": ["i"],
	"-": ["s"],
	_: ["u"],
}
