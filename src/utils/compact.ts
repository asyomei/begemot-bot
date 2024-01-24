type Falsy = false | 0 | "" | null | undefined

export function compact<T>(arr: (T | Falsy)[]): T[]
export function compact<T>(obj: { [K in keyof T]: T[K] }): {
	[K in keyof T as T[K] extends Falsy ? never : K]: T[K]
}
export function compact(obj: any): any {
	if (typeof obj !== "object" || !obj) return obj
	if (Array.isArray(obj)) return obj.filter(Boolean)

	const res = {} as any
	for (const key in obj) {
		if (obj[key]) res[key] = obj[key]
	}

	return res
}

export function compactStrict<T>(arr: (T | null | undefined)[]): T[]
export function compactStrict<T>(obj: { [K in keyof T]: T[K] }): {
	[K in keyof T as T[K] extends null | undefined ? never : K]: T[K]
}
export function compactStrict(obj: any): any {
	if (typeof obj !== "object" || !obj) return obj
	if (Array.isArray(obj)) return obj.filter((s) => s != null)

	const res = {} as any
	for (const key in obj) {
		if (obj[key] != null) res[key] = obj[key]
	}

	return res
}
