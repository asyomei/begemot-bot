import { Prisma } from "@prisma/client"
import { Numeric } from "#/types/numeric"
import { fullName } from "#/utils/full-name"
import { RedisStorage } from "#/utils/redis-storage"
import { DELAY } from "./consts"
import { RatingSession } from "./session.type"

export interface RatingServiceDeps {
	prismaUser: Prisma.UserDelegate
	storage: RedisStorage<RatingSession>
}

export class RatingService {
	constructor(private deps: RatingServiceDeps) {}

	async changeRating(userId: Numeric, value: number) {
		return await this.deps.prismaUser.update({
			where: { id: userId },
			data: { rating: { increment: value } },
			select: { rating: true },
		})
	}

	async getFullName(userId: Numeric) {
		const user = await this.deps.prismaUser.findUniqueOrThrow({
			where: { id: userId },
			select: { firstName: true, lastName: true },
		})

		return fullName(user.firstName, user.lastName)
	}

	async getRatingInfo(userId: Numeric) {
		return await this.deps.storage.get({ id: userId })
	}

	async setRatingInfo(userId: Numeric, value: number) {
		return await this.deps.storage.upsert({
			id: userId,
			create: {
				value,
				expire: DELAY,
			},
		})
	}
}
