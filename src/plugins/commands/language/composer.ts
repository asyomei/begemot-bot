import { Composer, Filter } from "grammy"
import { commandT } from "#/filters/command-t"
import { MyContext } from "#/types/context"
import { fallbackLng } from "#/utils/i18n"
import { LanguageController } from "./controller"

export interface LanguageComposerDeps {
	controller: LanguageController
}

export class LanguageComposer {
	constructor(private deps: LanguageComposerDeps) {
		this.comp
			.on("message:text")
			.filter(commandT("language"), this.language.bind(this))

		this.comp.callbackQuery(
			deps.controller.cbData.filter(),
			deps.controller.cbData.private(),
			this.languageButton.bind(this),
		)
	}

	async language(ctx: Filter<MyContext, "message:text">) {
		const [text, buttons] = this.deps.controller.language(
			ctx.from.id,
			ctx.lng ?? fallbackLng,
		)

		await ctx.reply(text, {
			reply_markup: { inline_keyboard: buttons },
		})
	}

	async languageButton(ctx: Filter<MyContext, "callback_query:data">) {
		const { lng } = this.deps.controller.cbData.unpack(ctx.callbackQuery.data)

		const text = await this.deps.controller.changeLanguage(ctx.from.id, lng)

		await ctx.answerCallbackQuery(text)
		await ctx.deleteMessage()
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
