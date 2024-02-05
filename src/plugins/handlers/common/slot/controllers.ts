import { User } from "grammy/types"
import { CommandTFiltered, commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { CommandArgs } from "#/utils/command-args"
import { fullName } from "#/utils/full-name"
import { SlotService } from "./service"

export class SlotController extends Controller {
	constructor(private service: SlotService) {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("slot"))
			.use(autoReply)
			.use((ctx) => this.command(ctx))
	}

	async command(ctx: MyContext & { from: User } & CommandTFiltered) {
		const args = this.cmdArgs.parse(ctx.match)
		if (!args) {
			await ctx.reply(this.cmdArgs.example(ctx.i18n.lng))
			return
		}

		const coins = await this.service.getCoins(ctx.from.id)
		if (coins < args.bet) {
			await ctx.reply(
				ctx.i18n.t("common.not-enough-coins", { coins, needed: args.bet }),
			)
			return
		}

		const row = this.service.getRow()
		const winning = this.service.getWinning(args.bet, row)
		const resultCoins = await this.service.addCoins(ctx.from.id, winning)

		const text = ctx.i18n.t("slot.text", {
			winning,
			name: fullName(ctx.from),
			bet: args.bet,
			row: row.join(" | "),
			outcome: winning > 0 ? "win" : "lose",
			coins: resultCoins,
		})
		await ctx.reply(text)
	}

	private cmdArgs = new CommandArgs("slot", {
		bet: [/([\d']+)/, (s) => BigInt(s!.replaceAll("'", "")), "500"],
	})
}
