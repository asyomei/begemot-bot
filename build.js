const { transformFileSync } = require("@swc/core")
const {
	copyFileSync,
	mkdirSync,
	readdirSync,
	rmSync,
	writeFileSync,
} = require("fs")
const { join, relative } = require("path")

const files = readdirSync("./src", {
	encoding: "utf-8",
	recursive: true,
	withFileTypes: true,
})

rmSync("./dist", { recursive: true, force: true })

for (const file of files) {
	if (file.isDirectory()) continue
	if (file.name.includes(".spec.")) continue

	const outpath = file.path.replace("src", "dist")
	mkdirSync(outpath, { recursive: true })

	const path = join(file.path, file.name)
	if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
		const js = transformFileSync(path, {
			sourceFileName: relative(outpath, path),
		})
		const name = withoutExt(file.name)

		if (js.map) {
			const link = `//# sourceMappingURL=${name}.js.map`
			writeFileSync(join(outpath, `${name}.js`), js.code + link)
			writeFileSync(join(outpath, `${name}.js.map`), js.map)
		} else {
			writeFileSync(join(outpath, `${name}.js`), js.code)
		}
	} else {
		copyFileSync(path, join(outpath, file.name))
	}
}

/** @param {string} path */
function withoutExt(path) {
	const idx = path.lastIndexOf(".")
	if (idx === -1) return path
	return path.slice(0, idx)
}
