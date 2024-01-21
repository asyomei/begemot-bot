import { basename, join } from "path"
import { readFile, readdir } from "fs/promises"
import { glob } from "glob"
import { Composer } from "grammy"
import { MyContext } from "#/types/context"

export async function importPlugins() {
	const cwd = join(__dirname, "..", "plugins")
	const dirs = (await readdir(cwd)).filter((s) => s !== "use.txt")
	const used = await readUseTxt(cwd)

	const unused = dirs.filter((dir) => !used.includes(dir))
	if (unused.length) {
		throw new Error(`Unused directories at ${cwd}: ${unused.join(" ")}`)
	}

	return new Composer<MyContext>(
		...(await Promise.all(used.map(importSubPlugins))),
	)
}

async function importSubPlugins(dir: string) {
	const cwd = join(__dirname, "..", "plugins", dir)
	const files = await fetchAllFiles(cwd)
	const used = await readUseTxt(cwd)

	const unused = files.filter((file) => !used.includes(file))
	if (unused.length) {
		const path = join(cwd, "use.txt")
		throw new Error(`Unused files at ${path}: ${unused.join(" ")}`)
	}

	return new Composer<MyContext>(
		...(await Promise.all(
			used
				.map((name) => `../plugins/${dir}/${name}`)
				.map((path) => import(path).then((mod) => mod.default)),
		)),
	)
}

async function fetchAllFiles(cwd: string): Promise<string[]> {
	const files = await glob(["*.ts", "*/index.ts"], {
		cwd,
		ignore: "_*/**",
		nodir: true,
		posix: true,
	})

	return files.map((file) => basename(file.replace("/index.ts", ""), ".ts"))
}

async function readUseTxt(cwd: string): Promise<string[]> {
	const data = await readFile(join(cwd, "use.txt"), "utf-8")
	return data.split(/\s/g).filter(Boolean)
}
