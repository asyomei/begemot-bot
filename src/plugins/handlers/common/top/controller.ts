import { Filter, InlineKeyboard } from "grammy"
import { User } from "grammy/types"
import { isObject, kebabCase, omitBy } from "lodash"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { Numeric } from "#/types/numeric"
import { CallbackData } from "#/utils/callback-data"
import { escapeHTML } from "#/utils/escape-html"
import { fullName } from "#/utils/full-name"
import { Lang, TOptions, tr } from "#/utils/i18n"
import { map2 } from "#/utils/misc"
import { ITEMS_ON_PAGE, MAX_PAGE, TOP_ITEMS } from "./consts"
import { TopService } from "./service"

export class TopController extends Controller {
	constructor(private service: TopService) {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("top"))
			.use(autoReply)
			.use((ctx) => this.command(ctx))

		this.composer
			.on("callback_query:data")
			.filter(this.cbData.filter("none"))
			.use((ctx) => this.callbackQueryNone(ctx))

		this.composer
			.on("callback_query:data")
			.filter(this.cbData.filter())
			.use((ctx) => this.callbackQuery(ctx))
	}

	async command(ctx: MyContext & { from: User }) {
		await ctx.reply(ctx.i18n.t("top.text"), {
			reply_markup: {
				inline_keyboard: this.topButtons(ctx.i18n.lng, ctx.from.id),
			},
		})
	}

	async callbackQueryNone(ctx: Filter<MyContext, "callback_query:data">) {
		await ctx.answerCallbackQuery()
		await ctx.editMessageText(ctx.i18n.t("top.text"), {
			reply_markup: {
				inline_keyboard: this.topButtons(ctx.i18n.lng, ctx.from.id),
			},
		})
	}

	async callbackQuery(ctx: Filter<MyContext, "callback_query:data">) {
		const { model, field, page } = this.cbData.unpack(ctx.callbackQuery.data)

		await ctx.answerCallbackQuery()

		let lines: string[]
		if (model === "user") {
			const users = await this.service.getUserTop(field, page)
			lines = users.map((u, i) => {
				const name = escapeHTML(fullName(u))
				const text = tr(
					ctx.i18n.lng,
					["top.items.user", kebabCase(field), "template"],
					omitBy(u, isObject) as TOptions,
				)
				return `${i + 1}. ${name} - ${text}`
			})
		} else {
			return
		}

		await ctx.editMessageText(lines.join("\n"), {
			reply_markup: this.topListMarkup(
				ctx.i18n.lng,
				ctx.from.id,
				model,
				field,
				page,
				lines.length,
			),
		})
	}

	private topListMarkup(
		lng: Lang,
		userId: Numeric,
		model: string,
		field: string,
		page: number,
		pageLength: number,
	) {
		const kb = new InlineKeyboard()

		if (page > 0) {
			kb.text("➡️", this.cbData.pack({ model, field, page: page - 1 }, [userId]))
		}
		if (page <= MAX_PAGE && pageLength === ITEMS_ON_PAGE) {
			kb.text("⬅️", this.cbData.pack({ model, field, page: page + 1 }, [userId]))
		}
		kb.row().text(
			tr(lng, "common.update"),
			this.cbData.pack({ model, field, page }, [userId]),
		)
		kb.row().text(
			tr(lng, "common.back"),
			this.cbData.pack("none", {}, [userId]),
		)

		return kb
	}

	private topButtons(lng: Lang, userId: Numeric) {
		return map2(TOP_ITEMS, ([model, field]) =>
			InlineKeyboard.text(
				tr(lng, ["top.items", model, kebabCase(field), "name"]),
				this.cbData.pack({ model, field, page: 0 }, [userId]),
			),
		)
	}

	private cbData = new CallbackData("top", "private", {
		none: {},
		default: { model: String, field: String, page: Number },
	})
}
