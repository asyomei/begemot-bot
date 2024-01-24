import { NextFunction } from "grammy"
import { User } from "grammy/types"
import { prisma } from "#/prisma"
import { MyContext } from "#/types/context"

export default async (ctx: MyContext, next: NextFunction) => {
	if (ctx.from) {
		await syncUser(ctx.from, !!ctx.message)
	}

	const replyUser = ctx.msg?.reply_to_message?.from
	if (replyUser) {
		await syncUser(replyUser)
	}

	await next()
}

async function syncUser(from: User, incrementMessages?: boolean) {
	await prisma.user.upsert({
		select: { id: true },
		where: { id: from.id },
		update: {
			firstName: from.first_name,
			lastName: from.last_name,
			username: from.username,
			messages: incrementMessages ? { increment: 1 } : undefined,
		},
		create: {
			id: from.id,
			firstName: from.first_name,
			lastName: from.last_name,
			username: from.username,
			isBot: from.is_bot,
			language: from.language_code,
		},
	})
}
