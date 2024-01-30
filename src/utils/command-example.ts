import { Numeric } from "#/types/numeric"
import { escapeHTML } from "./escape-html"
import { I18nNotFoundError, Lang, getI18nResource, tr } from "./i18n"

interface Command {
	name: string
	args: string[]
}

export function commandExample(
	lng: Lang,
	commandKey: string,
	exampleArgs: (string | Numeric)[] | string,
) {
	const prefix = lng === "en" ? "/" : "!"
	const command = getCommand(lng, commandKey)
	if (!command) {
		throw new I18nNotFoundError(
			lng,
			["commands", commandKey],
			"command with args",
		)
	}

	const example = Array.isArray(exampleArgs)
		? exampleArgs.join(" ")
		: exampleArgs
	return tr(lng, "common.command-example", {
		command: escapeHTML(
			`${prefix}${command.name} ${command.args.map((s) => `[${s}]`).join(" ")}`,
		),
		example: escapeHTML(`${prefix}${command.name} ${example}`),
	})
}

function getCommand(lng: Lang, key: string): Command | undefined {
	const cmd = getI18nResource(lng, ["commands", key])

	if (!(cmd && typeof cmd === "object")) return
	if (!("names" in cmd || "args" in cmd)) return

	const { names, args } = cmd
	if (!Array.isArray(names) || names.length === 0) return
	if (!Array.isArray(args) || args.length === 0) return

	return { name: names[0]!, args }
}
