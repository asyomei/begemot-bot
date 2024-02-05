import { PrismaClient } from "@prisma/client"
import { RandomService } from "#/services/random"
import { Numeric } from "#/types/numeric"
import { ITEMS } from "./consts"

export class SlotService {
	constructor(
		private prisma: Pick<PrismaClient, "user">,
		private random: RandomService,
	) {}

	getRow(): [string, string, string] {
		const next = () => this.random.choice(ITEMS)
		return [next(), next(), next()]
	}

	getWinning(bet: bigint, row: [string, string, string]) {
		if (row[0] === row[1] && row[1] === row[2]) {
			return bet * 3n
		}

		if (row[0] === row[1] || row[1] === row[2]) {
			return bet * 2n
		}

		return -bet
	}

	async getCoins(userId: Numeric) {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: { id: userId },
			select: { coins: true },
		})

		return user.coins
	}

	async addCoins(userId: Numeric, coins: bigint) {
		const user = await this.prisma.user.update({
			where: { id: userId },
			select: { coins: true },
			data: { coins: { increment: coins } },
		})

		return user.coins
	}
}
