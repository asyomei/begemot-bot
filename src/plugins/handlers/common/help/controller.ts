import { helpText } from "#/consts/help-text"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"

export class HelpController extends Controller {
	constructor() {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("help"), autoReply, (ctx) => this.command(ctx))
	}

	async command(ctx: MyContext) {
		await ctx.reply(helpText(ctx.i18n.lng))
	}
}
