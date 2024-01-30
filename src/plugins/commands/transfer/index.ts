import { prisma } from "#/prisma"
import { TransferComposer } from "./composer"
import { TransferController } from "./controller"
import { TransferService } from "./service"

export default new TransferComposer({
	controller: new TransferController({
		service: new TransferService({
			prismaTransaction: prisma.$transaction.bind(prisma),
			prismaUser: prisma.user,
		}),
	}),
})
