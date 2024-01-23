import { Composer, Filter } from "grammy"
import { commandT } from "#/filters/command-t"
import { MyContext } from "#/types/context"
import { BalanceController } from "./controller"

export interface BalanceComposerDeps {
	controller: BalanceController
}

export class BalanceComposer {
	constructor(private deps: BalanceComposerDeps) {
		this.comp.filter(commandT("balance"), this.balance.bind(this))
	}

	async balance(ctx: Filter<MyContext, "message:text">) {
		const text = await this.deps.controller.getBalance(ctx.from.id, ctx.lng)

		await ctx.reply(text)
	}

	private comp = new Composer<MyContext>().on("message:text")
	middleware = () => this.comp.middleware()
}
