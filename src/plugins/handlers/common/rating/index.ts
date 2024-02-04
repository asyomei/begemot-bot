import { prisma } from "#/prisma"
import { redis } from "#/redis"
import { RedisStorage } from "#/utils/redis-storage"
import { RatingController } from "./controller"
import { RatingService } from "./service"

export default new RatingController(
	new RatingService(prisma.user, new RedisStorage("rating", redis)),
)
