import { Composer } from "grammy"
import { commandT } from "#/filters/command-t"
import { MyContext } from "#/types/context"
import { compMiddleware } from "../_utils"
import { HelpController } from "./controller"

export class HelpComposer {
	constructor(private helpController: HelpController) {
		this.comp.filter(commandT("help"), this.help.bind(this))
	}

	async help(ctx: MyContext) {
		await ctx.reply(this.helpController.help(ctx.lng))
	}

	private comp = new Composer<MyContext>().on("message:text")
	middleware = compMiddleware(this.comp)
}
