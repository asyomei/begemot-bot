import { User } from "grammy/types"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { BalanceService } from "./service"

export class BalanceController extends Controller {
	constructor(private service: BalanceService) {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("balance"), autoReply, (ctx) => this.command(ctx))
	}

	async command(ctx: MyContext & { from: User }) {
		const coins = await this.service.getBalance(ctx.from.id)
		await ctx.reply(ctx.i18n.t("balance.text", { coins }))
	}
}
