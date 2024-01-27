import { Composer } from "grammy"
import { commandT } from "#/filters/command-t"
import { isSuperadmin } from "#/filters/is-superadmin"
import { autoReply } from "#/middlewares/auto-reply"
import { MyContext } from "#/types/context"
import { StatsController } from "./controller"

export interface StatsComposerDeps {
	controller: StatsController
}

export class StatsComposer {
	constructor(private deps: StatsComposerDeps) {
		const comp = this.comp.on("message:text").filter(isSuperadmin)

		comp.filter(commandT("admin.stats"), autoReply, this.stats.bind(this))
	}

	async stats(ctx: MyContext) {
		const text = await this.deps.controller.stats(ctx.lng)
		await ctx.reply(text)
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
