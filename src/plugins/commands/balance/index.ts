import { prisma } from "#/prisma"
import { BalanceComposer } from "./composer"
import { BalanceController } from "./controller"
import { BalanceService } from "./service"

export default new BalanceComposer({
	controller: new BalanceController({
		service: new BalanceService({
			prismaUser: prisma.user,
		}),
	}),
})
