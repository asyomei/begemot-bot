import { Composer } from "grammy"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { MyContext } from "#/types/context"
import { StartController } from "./controller"

export interface StartComposerDeps {
	controller: StartController
}

export class StartComposer {
	constructor(private deps: StartComposerDeps) {
		this.comp
			.on("message:text")
			.filter(commandT("start"), autoReply, this.start.bind(this))
	}

	async start(ctx: MyContext) {
		await ctx.reply(this.deps.controller.start(ctx.lng))
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
