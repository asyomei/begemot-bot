import { defineBotCommands } from "#/utils/bot-commands"

// Also add commands to help text
export const botCommands = defineBotCommands(
	[
		"help",
		"language",
		"balance",
		"bonus",
		"profile",
		"transfer",
		"top",
		"slot",
		"duel",
	],
	["start", "admin"],
)
