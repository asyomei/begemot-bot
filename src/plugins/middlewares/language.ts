import { NextFunction } from "grammy"
import { prisma } from "#/prisma"
import { MyContext } from "#/types/context"

export default async (ctx: MyContext, next: NextFunction) => {
	if (!ctx.from) return await next()

	const user = await prisma.user.findUnique({
		where: { id: ctx.from.id },
		select: { language: true },
	})

	ctx.lng = user ? user.language : ctx.from.language_code

	await next()
}
