import { Composer, Filter } from "grammy"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { MyContext } from "#/types/context"
import { ProfileController } from "./controller"

export interface ProfileComposerDeps {
	controller: ProfileController
}

export class ProfileComposer {
	constructor(private deps: ProfileComposerDeps) {
		const comp = this.comp.on("message:text")

		comp.filter(commandT("profile"), autoReply, this.userProfile.bind(this))
	}

	async userProfile(ctx: Filter<MyContext, "message:text">) {
		const text = await this.deps.controller.userProfile(ctx.lng, ctx.from.id)
		await ctx.reply(text, { parse_mode: "HTML" })
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
