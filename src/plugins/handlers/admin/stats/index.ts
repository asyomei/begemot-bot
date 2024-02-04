import { prisma } from "#/prisma"
import { StatsController } from "./controller"
import { StatsService } from "./service"

export default new StatsController(new StatsService(prisma))
