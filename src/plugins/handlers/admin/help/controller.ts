import { adminHelpText } from "#/consts/help-text"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { AdminController } from "#/plugins/controller"
import { MyContext } from "#/types/context"

export class AdminHelpController extends AdminController {
	constructor() {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("admin.help"), autoReply, (ctx) => this.command(ctx))
	}

	async command(ctx: MyContext) {
		await ctx.reply(adminHelpText(ctx.i18n.lng))
	}
}
