import { Composer, Filter } from "grammy"
import { HasReplyUserFiltered, hasReplyUser } from "#/filters/has-reply-user"
import { hearsT } from "#/filters/hears-t"
import { autoReply } from "#/middlewares/auto-reply"
import { MyContext } from "#/types/context"
import { BAD_RE, GOOD_RE } from "./consts"
import { RatingController } from "./controller"

export interface RatingComposerDeps {
	controller: RatingController
}

export class RatingComposer {
	constructor(private deps: RatingComposerDeps) {
		const comp = this.comp
			.on("message:text")
			.filter(hasReplyUser)
			.filter((ctx) => ctx.from.id !== ctx.replyUser.id)
			.use(autoReply)

		comp.hears(GOOD_RE, (ctx) => this.rating(ctx, 1))
		comp.hears(BAD_RE, (ctx) => this.rating(ctx, -1))

		comp.filter(hearsT("rating.good"), (ctx) => this.rating(ctx, 1))
		comp.filter(hearsT("rating.bad"), (ctx) => this.rating(ctx, -1))
	}

	async rating(
		ctx: Filter<MyContext, "message:text"> & HasReplyUserFiltered,
		value: number,
	) {
		const text = await this.deps.controller.rating(
			ctx.lng,
			ctx.from.id,
			ctx.replyUser.id,
			value,
		)

		await ctx.reply(text)
	}

	private comp = new Composer<MyContext>()
	middleware = () => this.comp.middleware()
}
