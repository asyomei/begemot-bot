import { readFileSync, readdirSync } from "fs"
import { basename, join } from "path"
import { set } from "lodash"
import { parse } from "yaml"
import { Resource } from "./types"

export function loadDir(cwd: string) {
	const resources: Record<string, Record<string, Resource>> = {}

	for (const lng of readdirSync(cwd)) {
		// biome-ignore lint/suspicious/noAssignInExpressions: nice expression
		loadFrom((resources[lng] = {}), join(cwd, lng))
	}

	return resources
}

function loadFrom(
	resources: Record<string, Resource>,
	cwd: string,
	nest: string[] = [],
) {
	const files = readdirSync(cwd, { withFileTypes: true })
	for (const file of files) {
		if (file.isDirectory()) {
			loadFrom(resources, join(cwd, file.name), [...nest, file.name])
			continue
		}

		const data = parse(readFileSync(join(cwd, file.name), "utf-8"))
		const key = basename(file.name, ".yaml")
		set(resources, [...nest, key].join("."), data)
	}
}
