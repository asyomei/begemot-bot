import { Context } from "grammy"
import { compact, memoize } from "lodash"
import { I18nNotFoundError, getI18nResource, languages } from "../utils/i18n"

export interface CommandTFiltered {
	match: string
}

export function commandT(key: string) {
	const commandChecks = getCommandChecks(key)

	if (commandChecks.length === 0) {
		throw new I18nNotFoundError("all", ["commands", key, "names"], "commands")
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

const getCommandChecks = memoize((key: string) => {
	const path = ["commands", key, "names"]

	return compact(
		languages.map((lng) => {
			const commands = getI18nResource(lng, path)

			if (!Array.isArray(commands) || commands.length === 0) return null

			return (msgCmd: string) => {
				const prefix = ["/", "!"].find((p) => msgCmd.startsWith(p))
				return !!prefix && commands.some((cmd) => msgCmd === prefix + cmd)
			}
		}),
	)
})

function splitOnce(text: string, re: RegExp): [string, string?] {
	const idx = text.match(re)?.index
	if (!idx) return [text]
	return [text.slice(0, idx), text.slice(idx + 1)]
}
