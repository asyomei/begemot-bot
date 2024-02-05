import { prisma } from "#/prisma"
import { redis } from "#/redis"
import { RandomService } from "#/services/random"
import { RedisStorage } from "#/utils/redis-storage"
import { DuelController } from "./controller"
import { DuelService } from "./service"

export default new DuelController(
	new DuelService(prisma, new RedisStorage("duel", redis), new RandomService()),
)
