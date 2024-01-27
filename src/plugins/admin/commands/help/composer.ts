import { Composer } from "grammy"
import { commandT } from "#/filters/command-t"
import { isSuperadmin } from "#/filters/is-superadmin"
import { MyContext } from "#/types/context"
import { AdminHelpController } from "./controller"

export interface AdminHelpComposerDeps {
	controller: AdminHelpController
}

export class AdminHelpComposer {
	constructor(private deps: AdminHelpComposerDeps) {
		const comp = this.comp.on("message:text").filter(isSuperadmin)

		comp.filter(commandT("admin.help"), this.help.bind(this))
	}

	async help(ctx: MyContext) {
		const text = this.deps.controller.help(ctx.lng)
		await ctx.reply(text)
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
