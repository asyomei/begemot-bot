import { dedent } from "./dedent"
import { I18nNotFoundError, Lang, getI18nResource, tr } from "./i18n"
import { memoize } from "./memoize"

type StringFunction = (lng: Lang) => string

export function build(
	[first, ...rest]: TemplateStringsArray,
	...funcs: StringFunction[]
): StringFunction {
	return memoize((lng) =>
		dedent(rest.reduce((a, c, i) => a + funcs[i]!(lng) + c, first!)),
	)
}

export function cmd(key: string): StringFunction {
	const path = ["commands", key, "names"]

	return (lng) => {
		const commands = getI18nResource(lng, path)

		if (!Array.isArray(commands) || commands.length === 0) {
			throw new I18nNotFoundError(lng, path, "commands")
		}

		const prefix = lng === "en" ? "/" : "!"
		return prefix + commands[0]!
	}
}

export function desc(key: string): StringFunction {
	const path = ["commands", key, "description"]

	return (lng) => {
		const message = getI18nResource(lng, path)

		if (typeof message !== "string") {
			throw new I18nNotFoundError(lng, path, "command description")
		}

		return message
	}
}

export function msg(key: string | string[]): StringFunction {
	return (lng) => tr(lng, key)
}
