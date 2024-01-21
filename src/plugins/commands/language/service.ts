import { Prisma } from "@prisma/client"

export class LanguageService {
	constructor(private prismaUser: Prisma.UserDelegate) {}

	async changeLanguage(userId: number | bigint, language: string) {
		await this.prismaUser.update({
			where: { id: userId },
			data: { language },
			select: { id: true },
		})
	}
}
