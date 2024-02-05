import { prisma } from "#/prisma"
import { TopController } from "./controller"
import { TopService } from "./service"

export default new TopController(new TopService(prisma))
