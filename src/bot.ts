import { Bot } from "grammy"
import { env } from "./env"
import { MyContext } from "./types/context"

export const bot = new Bot<MyContext>(env.BOT_TOKEN)

bot.catch(({ stack }) => {
	console.error(stack)
})
