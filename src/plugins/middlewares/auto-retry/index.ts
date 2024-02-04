import { autoRetry } from "@grammyjs/auto-retry"
import { Context, NextFunction } from "grammy"

const middleware = autoRetry()

export default async (ctx: Context, next: NextFunction) => {
	ctx.api.config.use(middleware)
	await next()
}
