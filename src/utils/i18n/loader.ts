import { readFile, readdir } from "fs/promises"
import { basename, join } from "path"
import { parse } from "yaml"
import { Resource } from "./types"

export async function loadDir(cwd: string) {
  const resources: Record<string, Record<string, Resource>> = {}

  for (const lng of await readdir(cwd)) {
    resources[lng] = {}
    const lngRes = resources[lng]!

    for (const name of await readdir(join(cwd, lng))) {
      const data = await readFile(join(cwd, lng, name), "utf-8").then(parse)
      lngRes[basename(name, ".yaml")] = data
    }
  }

  return resources
}
