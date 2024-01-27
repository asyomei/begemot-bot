import { basename, join } from "path"
import { readFile, readdir } from "fs/promises"
import { glob } from "glob"
import { Composer } from "grammy"
import { MyContext } from "#/types/context"

const pluginsDir = join(__dirname, "..", "plugins")

export async function importPlugins(dir?: string, used?: string[]) {
	const cwd = dir ? join(pluginsDir, dir) : pluginsDir
	const dirs = (await readdir(cwd)).filter((s) => s !== "use.txt")
	used ??= await readUseTxt(cwd)

	const unused = dirs.filter(
		(dir) => !used!.some((usedDir) => usedDir.endsWith(dir)),
	)
	if (unused.length) {
		const path = join(cwd, "use.txt")
		throw new Error(`Unused directories at ${path}: ${unused.join(" ")}`)
	}

	const subPlugins = await Promise.all(used.map(importSubPlugins))
	return new Composer<MyContext>(...subPlugins)
}

async function importSubPlugins(dir: string): Promise<Composer<MyContext>> {
	const cwd = join(pluginsDir, dir)
	const files = await fetchAllFiles(cwd)
	const used = await readUseTxt(cwd)

	if (!files.length && used.length) {
		const subUsed = used.map((usedDir) => join(dir, usedDir))
		return await importPlugins(dir, subUsed)
	}

	const unused = files.filter((file) => !used.includes(file))
	if (unused.length) {
		const path = join(cwd, "use.txt")
		throw new Error(`Unused files at ${path}: ${unused.join(" ")}`)
	}

	const paths = used.map((name) => `../plugins/${dir}/${name}`)
	const middlewares = await Promise.all(
		paths.map((path) => import(path).then((mod) => mod.default)),
	)
	return new Composer<MyContext>(...middlewares)
}

async function fetchAllFiles(cwd: string): Promise<string[]> {
	const files = await glob(["*.{ts,js}", "*/index.{ts,js}"], {
		cwd,
		ignore: "_*/**",
		nodir: true,
		posix: true,
	})

	return files.map((file) => basename(removeIndexExt(file)))
}

async function readUseTxt(cwd: string): Promise<string[]> {
	const data = await readFile(join(cwd, "use.txt"), "utf-8")
	return data.split(/\s+/g).filter(Boolean)
}

function removeIndexExt(path: string) {
	let idx = path.lastIndexOf("/index.")
	if (idx === -1) idx = path.lastIndexOf(".")
	if (idx === -1) return path
	return path.slice(0, idx)
}
