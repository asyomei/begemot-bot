import { apiThrottler } from "@grammyjs/transformer-throttler"
import { Context, NextFunction } from "grammy"

const middleware = apiThrottler()

export default async (ctx: Context, next: NextFunction) => {
	ctx.api.config.use(middleware)
	await next()
}
