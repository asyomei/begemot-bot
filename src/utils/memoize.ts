export const memoize = <P extends [any, ...any[]], T>(
	fn: (...args: P) => T,
	cacheFn: (arg: P[0]) => string = String,
): ((...args: P) => T) => {
	const cache: Record<string, T> = {}

	return (...args: P) => {
		const key = cacheFn(args[0])
		cache[key] ??= fn(...args)
		return cache[key]!
	}
}
