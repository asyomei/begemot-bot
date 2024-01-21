import { BotCommand } from "grammy/types"
import { I18nNotFoundError, getI18nResource, languages } from "./i18n"

export function defineBotCommands(
	include: string[],
	exclude: string[] = [],
): [string, BotCommand[]][] {
	const commands = Object.keys(getI18nResource("en", "commands") ?? {})

	const unused = commands.filter(
		(cmd) => !(include.includes(cmd) || exclude.includes(cmd)),
	)
	if (unused.length) {
		throw new Error(`Unused bot commands: ${unused.join(" ")}`)
	}

	return languages.map((lng) => {
		const botCommands = include.map((command) => {
			const path = ["commands", command, "description"]
			const description = getI18nResource(lng, path)

			if (typeof description !== "string") {
				throw new I18nNotFoundError(lng, path, "command description")
			}

			return { command, description }
		})

		return [lng, botCommands]
	})
}
