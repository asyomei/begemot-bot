import { prisma } from "#/prisma"
import { BalanceController } from "./controller"
import { BalanceService } from "./service"

export default new BalanceController(new BalanceService(prisma.user))
