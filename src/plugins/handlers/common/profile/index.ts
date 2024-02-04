import { prisma } from "#/prisma"
import { ProfileTemplate } from "#/services/profile-template"
import { ProfileController } from "./controller"
import { ProfileService } from "./service"

export default new ProfileController(
	new ProfileService(prisma.user, new ProfileTemplate()),
)
