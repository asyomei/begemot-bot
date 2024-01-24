export function omit<T, K extends keyof T>(obj: T, omit: K[]): Omit<T, K> {
	const res: any = {}

	for (const key in obj) {
		if (omit.includes(key as never)) continue
		res[key] = obj[key]
	}

	return res
}
