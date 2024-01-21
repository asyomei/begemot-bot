import { NextFunction } from "grammy"
import { MyContext } from "#/types/context"

export default async (ctx: MyContext, next: NextFunction) => {
	ctx.lng = ctx.from?.language_code

	await next()
}
