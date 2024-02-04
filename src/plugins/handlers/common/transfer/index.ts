import { prisma } from "#/prisma"
import { TransferController } from "./controller"
import { TransferService } from "./service"

export default new TransferController(new TransferService(prisma))
