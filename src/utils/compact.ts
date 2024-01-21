export const compact = <T>(
	arr: (T | false | 0 | "" | null | undefined)[],
): T[] => arr.filter(Boolean) as T[]
