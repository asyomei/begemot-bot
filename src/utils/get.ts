export function get(obj: object, path: string): unknown {
	return _get(obj, path.split("."))
}

function _get(obj: any, path: string[]) {
	if (obj == null || path.length === 0) return obj

	const [key, ...rest] = path
	return _get(obj[key!], rest)
}
