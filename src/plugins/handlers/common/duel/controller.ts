import { User } from "grammy/types"
import { sample } from "lodash"
import { commandT } from "#/filters/command-t"
import { getReplyUser } from "#/filters/has-reply-user"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { fullName } from "#/utils/full-name"
import { DuelService } from "./service"

export class DuelController extends Controller {
	constructor(private service: DuelService) {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("duel"))
			.use(autoReply)
			.use((ctx) => this.command(ctx))
	}

	async command(ctx: MyContext & { from: User }) {
		const replyUser = getReplyUser(ctx)
		if (!replyUser || ctx.from.id === replyUser.id) {
			await ctx.reply(ctx.i18n.t("duel.specify-user"))
			return
		}

		const result = await this.service.duel(ctx.from.id, replyUser.id)
		if ("firstDelay" in result) {
			await ctx.reply(
				ctx.i18n.t("duel.defeated.first", { delay: result.firstDelay }),
			)
			return
		}
		if ("secondDelay" in result) {
			await ctx.reply(
				ctx.i18n.t("duel.defeated.second", { delay: result.secondDelay }),
			)
			return
		}

		let action: string
		let outcome: string
		if (result.winner) {
			const opts = {
				winner: result.winner.firstName,
				loser: result.loser.firstName,
			}
			action = sample(ctx.i18n.res("duel.actions.win", opts)) as string
			outcome = sample(ctx.i18n.res("duel.outcomes.win", opts)) as string
		} else {
			const opts = {
				first: result.first.firstName,
				second: result.second.firstName,
			}
			action = sample(ctx.i18n.res("duel.actions.draw", opts)) as string
			outcome = sample(ctx.i18n.res("duel.outcomes.draw", opts)) as string
		}

		const text = ctx.i18n.t("duel.text", {
			action,
			outcome,
			first: fullName(result.first),
			second: fullName(result.second),
		})
		await ctx.reply(text)
	}
}
