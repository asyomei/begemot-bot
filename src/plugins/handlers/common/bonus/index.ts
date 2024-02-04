import { prisma } from "#/prisma"
import { redis } from "#/redis"
import { RandomService } from "#/services/random"
import { RedisStorage } from "#/utils/redis-storage"
import { BonusController } from "./controller"
import { BonusService } from "./service"

export default new BonusController(
	new BonusService(
		prisma.user,
		new RedisStorage("bonus", redis),
		new RandomService(),
	),
)
