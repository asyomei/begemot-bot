import { RunnerHandle, run } from "@grammyjs/runner"
import { bot } from "./bot"
import { I18n } from "./utils/i18n"
import { importPlugins } from "./utils/import-plugins"

let runner: RunnerHandle | undefined

async function start() {
	await I18n.init("translations")

	const plugins = await importPlugins()

	bot.use((ctx, next) => ctx.from?.id === 740462955 && next())
	bot.use(plugins)

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
}

process.once("SIGINT", exit)
process.once("SIGHUP", exit)
process.once("SIGTERM", exit)

start()
