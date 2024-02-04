import fp from "lodash/fp"
export { fp }

export const when = <T, R>(pred: (val: T) => boolean, map: (val: T) => R) =>
	fp.cond([
		[pred, map],
		[fp.T, fp.identity],
	])

export const map2 = <T, R>(
	arr: T[][],
	mapFn: (val: T, row: number, col: number) => R,
): R[][] => arr.map((row, i) => row.map((val, j) => mapFn(val, i, j)))
