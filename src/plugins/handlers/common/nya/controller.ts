import { Filter, InlineKeyboard } from "grammy"
import { User } from "grammy/types"
import { CommandTFiltered, hearsT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { CallbackData } from "#/utils/callback-data"
import { CommandArgs } from "#/utils/command-args"
import { Lang, tr } from "#/utils/i18n"
import { END_POINTS } from "./consts"
import { NyaService } from "./service"
import * as nya from "./utils"

export class NyaController extends Controller {
	constructor(private service: NyaService) {
		super()
		const msg = this.composer.on("message:text")
		const cbd = this.composer.on("callback_query:data")

		msg.filter(hearsT("nya.trigger"), autoReply, (ctx) => this.trigger(ctx))
		msg.command("sfw", (ctx) => this.changeMode(ctx, "sfw"))
		msg.command("nsfw", (ctx) => this.changeMode(ctx, "nsfw"))

		cbd.filter(this.cbData.filter({ action: "more" }), (ctx) =>
			this.callbackMore(ctx),
		)
		cbd.filter(this.cbData.filter({ action: "name" }), (ctx) =>
			this.callbackName(ctx),
		)
	}

	async trigger(ctx: MyContext & CommandTFiltered & { from: User }) {
		const mode = await this.service.getMode(ctx.from.id)

		if (ctx.match === "?") {
			return await ctx.reply(nya.getHelp(ctx.i18n.lng, mode))
		}

		const args = this.cmdArgs.parse(ctx.match)
		const type = args?.match ? nya.getType(args.match) : nya.getRandomType(mode)

		if (!type) {
			return await ctx.reply(ctx.i18n.t("nya.no-type"))
		}

		if (!(type in END_POINTS[mode])) {
			return await ctx.reply(ctx.i18n.t("nya.change-mode"))
		}

		ctx.chatAction = "upload_photo"

		const url = await nya.getImageUrl(mode, type)
		if (!url) {
			return await ctx.reply(ctx.i18n.t("common.something-wrong"))
		}

		await this.reply(ctx, mode, type, url)
	}

	async changeMode(ctx: MyContext & { from: User }, mode: "sfw" | "nsfw") {
		await Promise.all([
			this.service.changeMode(ctx.from.id, mode),
			ctx.deleteMessage(),
		])
	}

	async callbackMore(ctx: Filter<MyContext, "callback_query:data">) {
		const mode = await this.service.getMode(ctx.from.id)
		const { type } = this.cbData.unpack(ctx.callbackQuery.data)

		if (!(type in END_POINTS[mode])) {
			return await ctx.answerCallbackQuery(ctx.i18n.t("nya.change-mode"))
		}

		ctx.chatAction = "upload_photo"

		const url = await nya.getImageUrl(mode, type)
		if (!url) {
			return await ctx.answerCallbackQuery(ctx.i18n.t("common.something-wrong"))
		}

		await ctx.answerCallbackQuery()
		await this.reply(ctx, mode, type, url)
	}

	async callbackName(ctx: Filter<MyContext, "callback_query:data">) {
		const { type } = this.cbData.unpack(ctx.callbackQuery.data)
		const name = nya.getName(ctx.i18n.lng, type)
		const text = name ? `${type} (${name})` : type
		await ctx.answerCallbackQuery(text)
	}

	private buttons(lng: Lang, type: string) {
		return [
			[
				InlineKeyboard.text(
					tr(lng, "nya.more"),
					this.cbData.pack({ type, action: "more" }),
				),
				InlineKeyboard.text(
					tr(lng, "nya.type"),
					this.cbData.pack({ type, action: "name" }),
				),
			],
		]
	}

	private async reply(ctx: MyContext, mode: string, type: string, url: string) {
		const opts = {
			reply_markup: { inline_keyboard: this.buttons(ctx.i18n.lng, type) },
			has_spoiler: mode === "nsfw",
		}

		if (url.endsWith(".gif")) {
			await ctx.replyWithAnimation(url, opts)
		} else {
			await ctx.replyWithPhoto(url, opts)
		}
	}

	private cmdArgs = new CommandArgs("nya", { match: [/(\w+)?/] })
	private cbData = new CallbackData("nya", "public", {
		default: { action: String, type: String },
	})
}
