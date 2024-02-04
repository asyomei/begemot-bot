import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"

export class StartController extends Controller {
	constructor() {
		super()

		const command = this.command.bind(this)
		this.composer
			.on("message:text")
			.filter(commandT("start"), autoReply, command)
	}

	async command(ctx: MyContext) {
		await ctx.reply(ctx.i18n.t("start.text"))
	}
}
