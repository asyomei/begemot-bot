import { join } from "path"
import { readFile } from "fs/promises"
import { Composer } from "grammy"
import { parse } from "toml"
import { MyContext } from "#/types/context"

const pluginsDir = join(__dirname, "..", "plugins")

export async function importPlugins() {
	const paths = await getUsed(pluginsDir).then(toPaths)

	const middlewares = await Promise.all(paths.map(importPlugin))
	return new Composer<MyContext>(...middlewares)
}

async function importPlugin(path: string[]) {
	const mod = await import(`../plugins/${path.join("/")}`)
	return mod.default
}

async function getUsed(dir: string) {
	return await readFile(join(dir, "use.toml"), "utf8").then(parse)
}

function toPaths(used: any, prefix?: string[]) {
	return Object.entries(used).flatMap(([key, obj]): string[][] => {
		if (!obj) return []

		const to = prefix ? [...prefix, key] : [key]
		return typeof obj === "object" ? toPaths(obj, to) : [to]
	})
}
