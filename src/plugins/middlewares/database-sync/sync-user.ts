import { Prisma } from "@prisma/client"
import { User } from "grammy/types"

export async function syncUser(
	prismaUser: Prisma.UserDelegate,
	from: User,
	incrementMessages?: boolean,
) {
	await prismaUser.upsert({
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
