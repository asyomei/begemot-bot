import { readFileSync, readdirSync } from "fs"
import { basename, join } from "path"
import { parse } from "yaml"
import { Resource } from "./types"

export function loadDir(cwd: string) {
	const resources: Record<string, Record<string, Resource>> = {}

	for (const lng of readdirSync(cwd)) {
		resources[lng] = {}
		const lngRes = resources[lng]!

		for (const name of readdirSync(join(cwd, lng))) {
			const data = parse(readFileSync(join(cwd, lng, name), "utf-8"))
			lngRes[basename(name, ".yaml")] = data
		}
	}

	return resources
}
