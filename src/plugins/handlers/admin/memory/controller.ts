import { commandT } from "#/filters/command-t"
import { autoReply } from "#/middlewares/auto-reply"
import { AdminController } from "#/plugins/controller"
import { MyContext } from "#/types/context"
import { MemoryService } from "./service"

export class MemoryController extends AdminController {
	constructor(private service: MemoryService) {
		super()

		this.composer
			.on("message:text")
			.filter(commandT("admin.memory"), autoReply, (ctx) => this.command(ctx))
	}

	async command(ctx: MyContext) {
		const memory = Number(this.service.getMemoryMB().toFixed(2))
		await ctx.reply(ctx.i18n.t("memory.text", { memory }))
	}
}
