import { Composer } from "grammy"
import { commandT } from "#/filters/command-t"
import { MyContext } from "#/types/context"
import { compMiddleware } from "../_utils"
import { StartController } from "./controller"

export class StartComposer {
	constructor(private con: StartController) {
		this.comp.filter(commandT("start"), this.start.bind(this))
	}

	async start(ctx: MyContext) {
		await ctx.reply(this.con.start(ctx.lng))
	}

	private comp = new Composer<MyContext>().on("message:text")
	middleware = compMiddleware(this.comp)
}
