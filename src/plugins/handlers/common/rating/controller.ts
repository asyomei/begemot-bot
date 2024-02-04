import { User } from "grammy/types"
import { HasReplyUserFiltered, hasReplyUser } from "#/filters/has-reply-user"
import { hearsT } from "#/filters/hears-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { BAD_RE, GOOD_RE } from "./consts"
import { RatingService } from "./service"

export class RatingController extends Controller {
	constructor(private service: RatingService) {
		super()
		const comp = this.composer
			.on("message:text")
			.filter(hasReplyUser)
			.filter((ctx) => ctx.from.id !== ctx.replyUser.id)
			.use(autoReply)

		comp.hears(GOOD_RE, (ctx) => this.hears(ctx, 1))
		comp.hears(BAD_RE, (ctx) => this.hears(ctx, -1))

		comp.filter(hearsT("rating.good"), (ctx) => this.hears(ctx, 1))
		comp.filter(hearsT("rating.bad"), (ctx) => this.hears(ctx, -1))
	}

	async hears(
		ctx: MyContext & { from: User } & HasReplyUserFiltered,
		value: number,
	) {
		const allowed = await this.service.allowRating(ctx.from.id, value)
		if (!allowed) {
			await ctx.reply(ctx.i18n.t("rating.delay"))
			return
		}

		const rating = await this.service.changeRating(ctx.replyUser.id, value)
		const text = ctx.i18n.t("rating.changed", {
			rating,
			name: await this.service.getFullName(ctx.replyUser.id),
		})
		await ctx.reply(text)
	}
}
