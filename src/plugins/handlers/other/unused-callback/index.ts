import { Composer } from "grammy"
import { MyContext } from "#/types/context"

const composer = new Composer<MyContext>()
export default composer

composer.on("callback_query", async (ctx) => {
	const { data } = ctx.callbackQuery
	console.log(`Callback query with data "${data}" hasn't been handled`)

	await ctx.answerCallbackQuery()
})
