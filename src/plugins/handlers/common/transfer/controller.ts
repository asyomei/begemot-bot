import { User } from "grammy/types"
import { CommandTFiltered, commandT } from "#/filters/command-t"
import { getReplyUser } from "#/filters/has-reply-user"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { CommandArgs } from "#/utils/command-args"
import { commandExample } from "#/utils/command-example"
import { escapeHTML } from "#/utils/escape-html"
import { MIN_AMOUNT } from "./consts"
import { TransferService } from "./service"

export class TransferController extends Controller {
	constructor(private service: TransferService) {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("transfer"), autoReply, (ctx) => this.command(ctx))
	}

	async command(ctx: MyContext & CommandTFiltered & { from: User }) {
		const args = this.cmdArgs.parse(ctx.match)
		const toKey = args?.toKey ?? getReplyUser(ctx)?.id

		if (args?.amount == null || toKey == null) {
			const text = commandExample(
				ctx.i18n.lng,
				"transfer",
				this.cmdArgs.exampleArgs,
			)
			await ctx.reply(text)
			return
		}

		if (args.amount < MIN_AMOUNT) {
			await ctx.reply(ctx.i18n.t("transfer.min-amount", { coins: MIN_AMOUNT }))
			return
		}

		const result = await this.service.transfer(ctx.from.id, toKey, args.amount)
		if (!result) {
			await ctx.reply(ctx.i18n.t("transfer.missing-user"))
			return
		}

		if ("coins" in result) {
			const text = ctx.i18n.t("transfer.not-enough", {
				amount: args.amount,
				coins: result.coins,
			})
			await ctx.reply(text)
			return
		}

		const text = ctx.i18n.t("transfer.complete", {
			amount: args.amount,
			fromName: result.from.firstName,
			toName: result.to.firstName,
			fromCoins: result.from.coins,
			toCoins: result.to.coins,
		})
		await ctx.reply(text)
	}

	private cmdArgs = new CommandArgs({
		amount: [/([\d']+)/, (s) => BigInt(s!.replaceAll("'", "")), "5'000"],
		toKey: [/@*(\w+)?$/, (s) => s, "@example_user"],
	})
}
