import fp from "lodash/fp"
import { Simplify } from "#/types/simplify"

type OnlyFunctions<T> = Simplify<{
	[K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K]
}>

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

export const includesIn =
	<T>(target: T[], fromIndex?: number) =>
	(searchElement: T) =>
		target.includes(searchElement, fromIndex)

export const bindAt = <
	T extends Record<string, any>,
	K extends keyof OnlyFunctions<T>,
>(
	obj: T,
	key: K,
): T[K] => obj[key].bind(obj) as T[K]
