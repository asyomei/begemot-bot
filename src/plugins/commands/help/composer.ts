import { Composer } from "grammy"
import { commandT } from "#/filters/command-t"
import { MyContext } from "#/types/context"
import { HelpController } from "./controller"

export interface HelpComposerDeps {
	controller: HelpController
}

export class HelpComposer {
	constructor(private deps: HelpComposerDeps) {
		this.comp.on("message:text").filter(commandT("help"), this.help.bind(this))
	}

	async help(ctx: MyContext) {
		await ctx.reply(this.deps.controller.help(ctx.lng))
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
