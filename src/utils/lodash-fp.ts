import fp from "lodash/fp"
export { fp }

export const when = <T, R>(pred: (val: T) => boolean, map: (val: T) => R) =>
	fp.cond([
		[pred, map],
		[fp.T, fp.identity],
	])
