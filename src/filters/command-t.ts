import { Context } from "grammy"
import { compact, memoize } from "lodash"
import { I18nNotFoundError, getI18nResource, languages } from "../utils/i18n"

export interface CommandTFiltered {
	commandArgs: string[]
}

export function commandT(key: string) {
	const commandChecks = getCommandChecks(key)

	if (commandChecks.length === 0) {
		throw new I18nNotFoundError("all", ["commands", key, "names"], "commands")
	}

	return <C extends Context>(ctx: C): ctx is C & CommandTFiltered => {
		const text = ctx.msg?.text
		if (!text) return false

		const [botCommand, ...args] = compact(text.split(" "))
		const [command, mention] = botCommand!.split("@")

		if (mention && mention !== ctx.me.username) return false

		if (commandChecks.some((check) => check(command!))) {
			;(ctx as C & CommandTFiltered).commandArgs = args
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
