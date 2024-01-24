import { Composer, Filter } from "grammy"
import { commandT } from "#/filters/command-t"
import { MyContext } from "#/types/context"
import { BonusController } from "./controller"

export interface BonusComposerDeps {
	controller: BonusController
}

export class BonusComposer {
	constructor(private deps: BonusComposerDeps) {
		this.comp
			.on("message:text")
			.filter(commandT("bonus"), this.bonus.bind(this))

		this.comp.callbackQuery(
			deps.controller.cbData.filter(),
			deps.controller.cbData.private(),
			this.bonusField.bind(this),
		)
	}

	async bonus(ctx: Filter<MyContext, "message:text">) {
		const [text, buttons] = await this.deps.controller.bonus(
			ctx.from.id,
			ctx.lng,
		)

		await ctx.reply(text, {
			reply_markup: { inline_keyboard: buttons ?? [] },
			parse_mode: "HTML",
		})
	}

	async bonusField(ctx: Filter<MyContext, "callback_query:data">) {
		const { pos } = this.deps.controller.cbData.unpack(ctx.callbackQuery.data)

		const [text, buttons] = await this.deps.controller.bonusField(
			ctx.from.id,
			pos,
			ctx.lng,
		)

		await ctx.answerCallbackQuery(buttons ? undefined : text)
		if (buttons) {
			await ctx.editMessageText(text, {
				reply_markup: { inline_keyboard: buttons },
				parse_mode: "HTML",
			})
		}
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
