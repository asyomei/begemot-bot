import { prisma } from "#/prisma"
import { LanguageComposer } from "./composer"
import { LanguageController } from "./controller"
import { LanguageService } from "./service"

export default new LanguageComposer({
	controller: new LanguageController({
		service: new LanguageService({
			prismaUser: prisma.user,
		}),
	}),
})
