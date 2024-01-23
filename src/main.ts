import { RunnerHandle, run } from "@grammyjs/runner"
import { bot } from "./bot"
import { botCommands } from "./consts/bot-commands"
import { prisma } from "./prisma"
import { importPlugins } from "./utils/import-plugins"

let runner: RunnerHandle | undefined

async function start() {
	const plugins = await importPlugins()

	bot.use((ctx, next) => ctx.from?.id === 740462955 && next())
	bot.use(plugins)

	if (process.argv.includes("--set-commands")) {
		await Promise.all(
			botCommands.map(([lng, commands]) =>
				bot.api.setMyCommands(commands, { language_code: lng }),
			),
		)
		console.log("Commands are set")
	}

	if (process.argv.includes("--skip-updates")) {
		await bot.api.deleteWebhook({ drop_pending_updates: true })
		console.log("Updates skipped")
	}

	runner = run(bot, {
		runner: {
			fetch: {
				allowed_updates: ["message", "callback_query"],
			},
		},
	})

	await bot.init()
	console.log(`@${bot.botInfo.username} started`)
}

const exit = async () => {
	console.log("Goodbye!")

	if (runner?.isRunning()) {
		await runner.stop()
	}

	await prisma.$disconnect()
}

process.once("SIGINT", exit)
process.once("SIGHUP", exit)
process.once("SIGTERM", exit)

start()
