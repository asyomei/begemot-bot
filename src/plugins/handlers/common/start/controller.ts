import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"

export class StartController extends Controller {
	constructor() {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("start"), autoReply, (ctx) => this.command(ctx))
	}

	async command(ctx: MyContext) {
		await ctx.reply(ctx.i18n.t("start.text"))
	}
}
