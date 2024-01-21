export function dedent(text: string): string
export function dedent(template: TemplateStringsArray, ...args: any[]): string
export function dedent(
	...params: [string] | [TemplateStringsArray, ...any[]]
): string {
	if (params.length > 1) {
		const [arr, args] = params as [TemplateStringsArray, ...any[]]
		const text = arr.slice(1).reduce((a, c, i) => a + args[i] + c, arr[0]!)
		return dedent(text)
	}

	const [text] = params as [string]

	const [first, ...lines] = text.trim().split("\n")
	const offset = Math.min(...lines.slice(1).map(countLeadingSpaces))

	return [first, ...lines.map((s) => s.slice(offset))].join("\n")
}

function countLeadingSpaces(s: string) {
	let i = 0
	while (s[i] === " " && i < s.length) i++
	return i
}
