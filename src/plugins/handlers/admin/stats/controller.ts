import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { AdminController } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { StatsService } from "./service"

export class StatsController extends AdminController {
	constructor(private service: StatsService) {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("admin.stats"))
			.use(autoReply)
			.use((ctx) => this.command(ctx))
	}

	async command(ctx: MyContext) {
		const users = await this.service.countUsers()
		await ctx.reply(ctx.i18n.t("stats.text", { users }))
	}
}
