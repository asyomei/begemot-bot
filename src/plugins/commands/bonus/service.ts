import { Prisma } from "@prisma/client"
import { fullName } from "#/utils/full-name"
import { Expire, RedisStorage } from "#/utils/redis-storage"
import { BonusSession } from "./session.type"

export interface BonusServiceDeps {
	prismaUser: Prisma.UserDelegate
	storage: RedisStorage<BonusSession>
}

export class BonusService {
	constructor(private deps: BonusServiceDeps) {}

	async getUserFullname(userId: number | bigint): Promise<string> {
		const user = await this.deps.prismaUser.findUniqueOrThrow({
			where: { id: userId },
			select: { firstName: true, lastName: true },
		})

		return fullName(user.firstName, user.lastName)
	}

	async addCoins(userId: number | bigint, coins: number | bigint) {
		await this.deps.prismaUser.update({
			select: { id: true },
			where: { id: userId },
			data: { coins: { increment: coins } },
		})
	}

	async getSession(userId: number | bigint): Promise<BonusSession | null>
	async getSession(
		userId: number | bigint,
		create: BonusSession & Expire,
	): Promise<BonusSession>
	async getSession(userId: number | bigint, create?: BonusSession & Expire) {
		if (create) {
			return await this.deps.storage.upsert({ create, id: userId })
		}

		return await this.deps.storage.get({ id: userId })
	}

	async updateSession(
		userId: number | bigint,
		data: Partial<BonusSession> & Expire,
	) {
		return await this.deps.storage.update({ data, id: userId })
	}

	async getTTL(userId: number | bigint) {
		return await this.deps.storage.getTTL(userId)
	}
}
