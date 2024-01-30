import { Composer, Filter } from "grammy"
import { CommandTFiltered, commandT } from "#/filters/command-t"
import { hasReplyUser } from "#/filters/has-reply-user"
import { autoReply } from "#/middlewares/auto-reply"
import { MyContext } from "#/types/context"
import { commandExample } from "#/utils/command-example"
import { TransferController } from "./controller"

export interface TransferComposerDeps {
	controller: TransferController
}

export class TransferComposer {
	constructor(private deps: TransferComposerDeps) {
		const comp = this.comp.on("message:text")

		comp.filter(commandT("transfer"), autoReply, this.transfer.bind(this))
	}

	async transfer(ctx: Filter<MyContext, "message"> & CommandTFiltered) {
		const fromId = ctx.from.id
		const toKey = hasReplyUser(ctx) ? ctx.replyUser.id : ctx.commandArgs[1]
		const amount = ctx.commandArgs[0]

		if (!(toKey && amount && /[\d']+/.test(amount))) {
			const text = commandExample(ctx.lng, "transfer", "5'000 @example_bot")
			await ctx.reply(text, { parse_mode: "HTML" })
			return
		}

		const text = await this.deps.controller.transfer(
			ctx.lng,
			fromId,
			toKey,
			BigInt(amount.replaceAll("'", "")),
		)
		if (text) await ctx.reply(text, { parse_mode: "HTML" })
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
