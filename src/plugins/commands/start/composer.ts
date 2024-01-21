import { Composer } from "grammy"
import { MyContext } from "../../../types/context"
import { compMiddleware } from "../_utils"
import { StartController } from "./controller"

export class StartComposer {
	constructor(private startController: StartController) {
		this.comp.command("start", this.start.bind(this))
	}

	async start(ctx: MyContext) {
		await ctx.reply(this.startController.start(ctx.lng))
	}

	private comp = new Composer<MyContext>().on("message:text")
	middleware = compMiddleware(this.comp)
}
