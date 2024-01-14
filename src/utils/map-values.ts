export function mapValues<T, R>(
	obj: Record<string, T>,
	mapFn: (value: T, key: string) => R,
): Record<string, R> {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [key, mapFn(value, key)]),
	)
}
