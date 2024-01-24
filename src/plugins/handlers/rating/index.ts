import { prisma } from "#/prisma"
import { redis } from "#/redis"
import { RedisStorage } from "#/utils/redis-storage"
import { RatingComposer } from "./composer"
import { RatingController } from "./controller"
import { RatingService } from "./service"

export default new RatingComposer({
	controller: new RatingController({
		service: new RatingService({
			prismaUser: prisma.user,
			storage: new RedisStorage("rating", redis),
		}),
	}),
})
