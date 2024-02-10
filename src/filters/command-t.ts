import { Context } from "grammy"
import { castArray, compact, memoize } from "lodash"
import { eq } from "lodash/fp"
import { splitOnce } from "#/utils/split-once"
import { I18nNotFoundError, getI18nResource, languages } from "../utils/i18n"

export interface CommandOptions {
	getPath?(key: string | string[]): string[]
	prefixes?: string[]
}

export interface CommandTFiltered {
	match: string
}

export function commandT(
	key: string | string[],
	{
		getPath = (key) => ["commands", ...castArray(key), "names"],
		prefixes = ["/", "!"],
	}: CommandOptions = {},
) {
	const commandChecks = getCommandChecks(getPath(key), prefixes)

	if (commandChecks.length === 0) {
		throw new I18nNotFoundError("all", getPath(key), "commands")
	}

	return <C extends Context>(ctx: C): ctx is C & CommandTFiltered => {
		const text = ctx.msg?.text
		if (!text) return false

		const [botCommand, match] = splitOnce(text, /\s/)
		const [command, mention] = splitOnce(botCommand, /@/)

		if (mention && mention !== ctx.me.username) return false

		if (commandChecks.some((check) => check(command))) {
			;(ctx as C & CommandTFiltered).match = match?.trim() ?? ""
			return true
		}

		return false
	}
}

export const hearsT = (key: string | string[]) =>
	commandT(key, { getPath: castArray, prefixes: [] })

const getCommandChecks = memoize((path: string[], prefixes: string[]) => {
	return compact(
		languages.map((lng) => {
			const commands = getI18nResource(lng, path)

			const isArr = Array.isArray(commands) || typeof commands === "string"
			if (!isArr || commands.length === 0) return null
			const cmds = castArray(commands)

			return (msgCmd: string) => {
				if (prefixes.length === 0) return cmds.some(eq(msgCmd))
				const prefix = prefixes.find((p) => msgCmd.startsWith(p))
				return !!prefix && cmds.some((cmd) => msgCmd === prefix + cmd)
			}
		}),
	)
})
