import MessageFormat from "@messageformat/core"
import { mapValues } from "../map-values"
import { Resource } from "./types"

export function compileAll(
  resources: Record<string, Record<string, Resource>>,
) {
  return mapValues(resources, (res, lng) => {
    const mf = new MessageFormat(lng)
    return _compile(mf.compile.bind(mf), res)
  })
}

function _compile(compile: (x: string) => any, res: Resource): any {
  if (typeof res === "string") return compile(res)
  if (Array.isArray(res)) return res.map(compile)
  return mapValues(res, (x) => _compile(compile, x))
}
