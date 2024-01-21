import { NextFunction } from "grammy"
import { prisma } from "#/prisma"
import { MyContext } from "#/types/context"

export default async (ctx: MyContext, next: NextFunction) => {
	if (ctx.from) {
		await prisma.user.upsert({
			select: { id: true },
			where: { id: ctx.from.id },
			update: {
				firstName: ctx.from.first_name,
				lastName: ctx.from.last_name,
				username: ctx.from.username,
			},
			create: {
				id: ctx.from.id,
				firstName: ctx.from.first_name,
				lastName: ctx.from.last_name,
				username: ctx.from.username,
				isBot: ctx.from.is_bot,
				language: ctx.from.language_code,
			},
		})
	}

	await next()
}
