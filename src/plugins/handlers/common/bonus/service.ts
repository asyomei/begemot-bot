import { Prisma } from "@prisma/client"
import { RandomService } from "#/services/random"
import { Numeric } from "#/types/numeric"
import { RedisStorage } from "#/utils/redis-storage"
import { DELAY, ITEMS, ITEM_INCOMES, MAX_ATTEMPTS } from "./consts"
import { BonusSession } from "./session.type"

export class BonusService {
	constructor(
		private prismaUser: Prisma.UserDelegate,
		private storage: RedisStorage<BonusSession>,
		private random: RandomService,
	) {}

	async addCoins(userId: Numeric, coins: Numeric) {
		await this.prismaUser.update({
			where: { id: userId },
			data: { coins: { increment: coins } },
			select: { coins: true },
		})
	}

	async getOrInit(userId: Numeric) {
		return await this.storage.upsert({
			id: userId,
			create: {
				attempts: MAX_ATTEMPTS,
				items: this.random.shuffle(ITEMS, true),
				opened: [],
				lastIncome: 0,
				incomeTotal: 0,
				expire: DELAY,
			},
		})
	}

	async get(userId: Numeric) {
		return await this.storage.get({ id: userId })
	}

	async update(userId: Numeric, session: BonusSession, pos: number) {
		const income = this.getIncome(session.items[pos]!)

		return await this.storage.update({
			id: userId,
			data: {
				attempts: session.attempts - 1,
				opened: session.opened.concat(pos),
				lastIncome: income,
				incomeTotal: session.incomeTotal + income,
			},
		})
	}

	async getDelay(userId: Numeric) {
		return await this.storage.getTTL(userId)
	}

	private getIncome(item: string) {
		const [start, end] = ITEM_INCOMES[item] ?? Object.values(ITEM_INCOMES)[0]!
		return this.random.inti(start, end)
	}
}
