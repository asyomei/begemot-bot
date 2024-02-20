import { Filter, InlineKeyboard } from "grammy"
import { User } from "grammy/types"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { Numeric } from "#/types/numeric"
import { CallbackData } from "#/utils/callback-data"
import { Lang, languages, tr } from "#/utils/i18n"
import { LanguageService } from "./service"

export class LanguageController extends Controller {
	constructor(private service: LanguageService) {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("language"), autoReply, (ctx) => this.command(ctx))

		this.composer
			.on("callback_query:data")
			.filter(this.cbData.filter(), (ctx) => this.callbackQuery(ctx))
	}

	async command(ctx: MyContext & { from: User }) {
		const buttons = this.languageButtons(ctx.from.id, ctx.i18n.lng)

		await ctx.reply(ctx.i18n.t("language.choose"), {
			reply_markup: { inline_keyboard: buttons },
		})
	}

	async callbackQuery(ctx: Filter<MyContext, "callback_query:data">) {
		const { lng } = this.cbData.unpack(ctx.callbackQuery.data)

		await this.service.changeLanguage(ctx.from.id, lng)

		ctx.i18n.lng = lng
		await ctx.answerCallbackQuery(ctx.i18n.t("language.changed"))
		await ctx.deleteMessage()
	}

	private languageButtons(userId: Numeric, currentLng: Lang) {
		return languages.map((lng) => [
			InlineKeyboard.text(
				(currentLng === lng ? "✅ " : "") + tr(lng, "language.flag-name"),
				this.cbData.pack({ lng }, [userId]),
			),
		])
	}

	private cbData = new CallbackData("language", "private", {
		default: { lng: String },
	})
}
