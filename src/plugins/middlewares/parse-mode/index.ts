import { parseMode } from "@grammyjs/parse-mode"
import { Context, NextFunction } from "grammy"

const transformer = parseMode("HTML")

export default async (ctx: Context, next: NextFunction) => {
	ctx.api.config.use(transformer)

	await next()
}
