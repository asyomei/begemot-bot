import { Prisma } from "@prisma/client"
import { Numeric } from "#/types/numeric"
import { RedisStorage } from "#/utils/redis-storage"
import { DELAY } from "./consts"
import { RatingSession } from "./session.type"

export class RatingService {
	constructor(
		private prismaUser: Prisma.UserDelegate,
		private storage: RedisStorage<RatingSession>,
	) {}

	async changeRating(userId: Numeric, value: number) {
		const user = await this.prismaUser.update({
			where: { id: userId },
			data: { rating: { increment: value } },
			select: { rating: true },
		})

		return user.rating
	}

	async getUserName(userId: Numeric) {
		return await this.prismaUser.findUniqueOrThrow({
			where: { id: userId },
			select: { firstName: true, lastName: true },
		})
	}

	async allowRating(userId: Numeric, value: number) {
		const info = await this.storage.get({ id: userId })
		if (info) return false

		await this.storage.upsert({
			id: userId,
			create: { value, expire: DELAY },
		})

		return true
	}
}
