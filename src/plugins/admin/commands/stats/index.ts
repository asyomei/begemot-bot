import { prisma } from "#/prisma"
import { StatsComposer } from "./composer"
import { StatsController } from "./controller"
import { StatsService } from "./service"

export default new StatsComposer({
	controller: new StatsController({
		service: new StatsService({
			prismaUser: prisma.user,
		}),
	}),
})
