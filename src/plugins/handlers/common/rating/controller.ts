import { User } from "grammy/types"
import { hearsT } from "#/filters/command-t"
import { HasReplyUserFiltered, hasReplyUser } from "#/filters/has-reply-user"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { fullName } from "#/utils/full-name"
import { BAD_RE, GOOD_RE } from "./consts"
import { RatingService } from "./service"

export class RatingController extends Controller {
	constructor(private service: RatingService) {
		super()
		const comp = this.composer
			.on("message:text")
			.filter(hasReplyUser)
			.filter((ctx) => ctx.from.id !== ctx.replyUser.id)

		comp.hears(GOOD_RE, autoReply, (ctx) => this.hears(ctx, 1))
		comp.hears(BAD_RE, autoReply, (ctx) => this.hears(ctx, -1))

		comp.filter(hearsT("rating.good"), autoReply, (ctx) => this.hears(ctx, 1))
		comp.filter(hearsT("rating.bad"), autoReply, (ctx) => this.hears(ctx, -1))
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

		const name = await this.service.getUserName(ctx.replyUser.id).then(fullName)
		const rating = await this.service.changeRating(ctx.replyUser.id, value)
		const text = ctx.i18n.t("rating.changed", { name, rating })
		await ctx.reply(text)
	}
}
