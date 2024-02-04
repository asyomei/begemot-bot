import { prisma } from "#/prisma"
import { LanguageController } from "./controller"
import { LanguageService } from "./service"

export default new LanguageController(new LanguageService(prisma.user))
