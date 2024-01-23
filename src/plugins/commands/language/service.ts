import { Prisma } from "@prisma/client"

export interface LanguageServiceDeps {
	prismaUser: Prisma.UserDelegate
}

export class LanguageService {
	constructor(private deps: LanguageServiceDeps) {}

	async changeLanguage(userId: number | bigint, language: string) {
		await this.deps.prismaUser.update({
			where: { id: userId },
			data: { language },
			select: { id: true },
		})
	}
}
