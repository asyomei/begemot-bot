import { Composer } from "grammy"
import { commandT } from "#/filters/command-t"
import { MyContext } from "#/types/context"
import { StartController } from "./controller"

export interface StartComposerDeps {
	controller: StartController
}

export class StartComposer {
	constructor(private deps: StartComposerDeps) {
		this.comp.filter(commandT("start"), this.start.bind(this))
	}

	async start(ctx: MyContext) {
		await ctx.reply(this.deps.controller.start(ctx.lng))
	}

	private comp = new Composer<MyContext>().on("message:text")
	middleware = () => this.comp.middleware()
}
