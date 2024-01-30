import { prisma } from "#/prisma"
import { ProfileTemplate } from "#/services/profile-template"
import { ProfileComposer } from "./composer"
import { ProfileController } from "./controller"
import { ProfileService } from "./service"

export default new ProfileComposer({
	controller: new ProfileController({
		service: new ProfileService({
			prismaUser: prisma.user,
		}),
		template: new ProfileTemplate(),
	}),
})
