import { Bot, GrammyError } from "grammy"
import { env } from "./env"
import { MyContext } from "./types/context"

export const bot = new Bot<MyContext>(env.BOT_TOKEN)

bot.catch(({ error, stack }) => {
	if (error instanceof GrammyError) {
		if (error.description.includes("message is not modified")) return
	}

	console.error(stack)
})
