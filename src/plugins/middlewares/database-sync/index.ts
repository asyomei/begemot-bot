import { Context, NextFunction } from "grammy"
import { prisma } from "#/prisma"
import { syncUser } from "./sync-user"

export default async (ctx: Context, next: NextFunction) => {
	if (ctx.from) {
		await syncUser(prisma.user, ctx.from, !!ctx.message)
	}

	const replyUser = ctx.msg?.reply_to_message?.from
	if (replyUser) {
		await syncUser(prisma.user, replyUser)
	}

	await next()
}
