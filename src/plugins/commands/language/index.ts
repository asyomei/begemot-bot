import { prisma } from "#/prisma"
import { fromComposer } from "../_utils"
import { LanguageComposer } from "./composer"
import { LanguageController } from "./controller"
import { LanguageService } from "./service"

export default fromComposer(
	() =>
		new LanguageComposer(
			new LanguageController(new LanguageService(prisma.user)),
		),
)
