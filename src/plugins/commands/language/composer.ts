import { Composer, Filter } from "grammy"
import { commandT } from "#/filters/command-t"
import { MyContext } from "#/types/context"
import { fallbackLng } from "#/utils/i18n"
import { compMiddleware } from "../_utils"
import { LanguageController } from "./controller"

export class LanguageComposer {
	constructor(private con: LanguageController) {
		this.comp
			.on("message:text")
			.filter(commandT("language"), this.language.bind(this))

		this.comp.callbackQuery(
			con.cbData.filter(),
			con.cbData.private(),
			this.languageButton.bind(this),
		)
	}

	async language(ctx: Filter<MyContext, "message:text">) {
		const [text, buttons] = this.con.language(
			ctx.from.id,
			ctx.lng ?? fallbackLng,
		)

		await ctx.reply(text, {
			reply_markup: { inline_keyboard: buttons },
		})
	}

	async languageButton(ctx: Filter<MyContext, "callback_query:data">) {
		const { lng } = this.con.cbData.unpack(ctx.callbackQuery.data)

		const text = await this.con.changeLanguage(ctx.from.id, lng)

		await ctx.answerCallbackQuery(text)
		await ctx.deleteMessage()
	}

	private comp = new Composer<MyContext>()
	middleware = compMiddleware(this.comp)
}
