import { Composer, Filter } from "grammy"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { MyContext } from "#/types/context"
import { BalanceController } from "./controller"

export interface BalanceComposerDeps {
	controller: BalanceController
}

export class BalanceComposer {
	constructor(private deps: BalanceComposerDeps) {
		const comp = this.comp.on("message:text")

		comp.filter(commandT("balance"), autoReply, this.balance.bind(this))
	}

	async balance(ctx: Filter<MyContext, "message:text">) {
		const text = await this.deps.controller.getBalance(ctx.from.id, ctx.lng)

		await ctx.reply(text)
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
