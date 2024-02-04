import { Prisma } from "@prisma/client"
import { Numeric } from "#/types/numeric"

export class LanguageService {
	constructor(private prismaUser: Prisma.UserDelegate) {}

	async changeLanguage(userId: Numeric, language: string) {
		await this.prismaUser.update({
			where: { id: userId },
			data: { language },
			select: { language: true },
		})
	}
}
