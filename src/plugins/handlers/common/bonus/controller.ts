import { Filter, InlineKeyboard } from "grammy"
import { User } from "grammy/types"
import { chunk } from "lodash"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { Numeric } from "#/types/numeric"
import { CallbackData } from "#/utils/callback-data"
import { escapeHTML } from "#/utils/escape-html"
import { fullNameBy } from "#/utils/full-name"
import { CLOSED_ITEM, ROW } from "./consts"
import { BonusService } from "./service"

export class BonusController extends Controller {
	constructor(private service: BonusService) {
		super()

		const command = this.command.bind(this)
		this.composer
			.on("message:text")
			.filter(commandT("bonus"), autoReply, command)

		const callbackQuery = this.callbackQuery.bind(this)
		this.composer
			.on("callback_query:data")
			.filter(this.cbData.filter(), callbackQuery)
	}

	async command(ctx: MyContext & { from: User }) {
		const session = await this.service.getOrInit(ctx.from.id)

		if (session.attempts <= 0) {
			const delay = await this.service.getDelay(ctx.from.id)
			await ctx.reply(ctx.i18n.t("bonus.delay", { delay }))
			return
		}

		const text = ctx.i18n.t("bonus.text", {
			name: escapeHTML(fullNameBy(ctx.from)),
			attempts: session.attempts,
			lastIncome: session.lastIncome,
			incomeTotal: session.incomeTotal,
		})
		await ctx.reply(text, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: this.bonusField(
					ctx.from.id,
					session.items,
					session.opened,
				),
			},
		})
	}

	async callbackQuery(ctx: Filter<MyContext, "callback_query:data">) {
		const { pos } = this.cbData.unpack(ctx.callbackQuery.data)

		const session = await this.service.get(ctx.from.id)
		if (!session || session.attempts <= 0) {
			await ctx.answerCallbackQuery(ctx.i18n.t("bonus.no-attempts"))
			return
		}

		if (session.opened.includes(pos)) {
			await ctx.answerCallbackQuery(ctx.i18n.t("bonus.already-opened"))
			return
		}

		const updated = await this.service.update(ctx.from.id, session, pos)

		const text = ctx.i18n.t("bonus.text", {
			name: escapeHTML(fullNameBy(ctx.from)),
			attempts: updated.attempts,
			lastIncome: updated.lastIncome,
			incomeTotal: updated.incomeTotal,
		})
		await ctx.answerCallbackQuery()
		await ctx.editMessageText(text, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: this.bonusField(
					ctx.from.id,
					updated.items,
					updated.opened,
				),
			},
		})
	}

	private bonusField(userId: Numeric, items: string[], opened: number[]) {
		const buttons = items.map((item, i) =>
			InlineKeyboard.text(
				opened.includes(i) ? item : CLOSED_ITEM,
				this.cbData.pack({ pos: i }, [userId]),
			),
		)

		return chunk(buttons, ROW)
	}

	private cbData = new CallbackData("bonus", "private", {
		default: { pos: Number },
	})
}
