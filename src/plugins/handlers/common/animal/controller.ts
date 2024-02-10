import { InputFile } from "grammy"
import { hearsT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { END_POINTS } from "./consts"
import { getImageUrl } from "./utils"

export class AnimalController extends Controller {
	constructor() {
		super()
		const msg = this.composer.on("message:text")

		for (const animal of Object.keys(END_POINTS)) {
			msg.filter(hearsT(["animal.triggers", animal]), autoReply, (ctx) =>
				this.trigger(ctx, animal),
			)
		}
	}

	async trigger(ctx: MyContext, animal: string) {
		const url = await getImageUrl(animal)
		if (url) await ctx.replyWithPhoto(url)
	}
}
