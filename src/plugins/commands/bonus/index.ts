import { prisma } from "#/prisma"
import { redis } from "#/redis"
import { RandomService } from "#/services/random"
import { RedisStorage } from "#/utils/redis-storage"
import { BonusComposer } from "./composer"
import { BonusController } from "./controller"
import { BonusService } from "./service"

export default new BonusComposer({
	controller: new BonusController({
		random: new RandomService(),
		service: new BonusService({
			prismaUser: prisma.user,
			storage: new RedisStorage("bonus", redis),
		}),
	}),
})
