import { Prisma } from "@prisma/client"
import { User } from "grammy/types"
import { Lang } from "#/utils/i18n"

export async function getLanguage(
	prismaUser: Prisma.UserDelegate,
	from: User,
): Promise<Lang> {
	const user = await prismaUser.findUnique({
		where: { id: from.id },
		select: { language: true },
	})

	return user ? user.language : from.language_code
}
