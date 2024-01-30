import { Composer } from "grammy"
import { commandT } from "#/filters/command-t"
import { isSuperadmin } from "#/filters/is-superadmin"
import { autoReply } from "#/middlewares/auto-reply"
import { MyContext } from "#/types/context"
import { MemoryController } from "./controller"

export interface MemoryComposerDeps {
	controller: MemoryController
}

export class MemoryComposer {
	constructor(private deps: MemoryComposerDeps) {
		const comp = this.comp.on("message:text").filter(isSuperadmin)

		comp.filter(commandT("admin.memory"), autoReply, this.memory.bind(this))
	}

	async memory(ctx: MyContext) {
		const text = this.deps.controller.memory(ctx.lng)
		await ctx.reply(text)
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
