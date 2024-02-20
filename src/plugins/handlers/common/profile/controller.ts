import { User } from "grammy/types"
import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { Controller } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { ProfileService } from "./service"

export class ProfileController extends Controller {
	constructor(private service: ProfileService) {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("profile"), autoReply, (ctx) => this.command(ctx))
	}

	async command(ctx: MyContext & { from: User }) {
		const profile = await this.service.getProfile(ctx.i18n.lng, ctx.from.id)
		await ctx.reply(profile)
	}
}
