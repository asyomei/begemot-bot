import { Composer } from "grammy"
import { MyContext } from "../../types/context"

const comp = new Composer<MyContext>()
export default comp

comp.on("callback_query", async (ctx) => {
	const { data } = ctx.callbackQuery
	console.log(`Callback query with data "${data}" hasn't been handled`)

	await ctx.answerCallbackQuery()
})
