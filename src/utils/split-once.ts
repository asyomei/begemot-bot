export function splitOnce(text: string, re: RegExp): [string, string?] {
	const idx = text.match(re)?.index
	if (!idx) return [text]
	return [text.slice(0, idx), text.slice(idx + 1)]
}
