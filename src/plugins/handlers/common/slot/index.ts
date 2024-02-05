import { prisma } from "#/prisma"
import { RandomService } from "#/services/random"
import { SlotController } from "./controllers"
import { SlotService } from "./service"

export default new SlotController(new SlotService(prisma, new RandomService()))
