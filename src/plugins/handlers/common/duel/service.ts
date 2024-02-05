import { PrismaClient } from "@prisma/client"
import { prop } from "lodash/fp"
import { RandomService } from "#/services/random"
import { Numeric } from "#/types/numeric"
import { RedisStorage } from "#/utils/redis-storage"
import { DELAY } from "./consts"
import { DuelSession } from "./session.type"

export class DuelService {
	constructor(
		private prisma: Pick<PrismaClient, "$transaction" | "user">,
		private storage: RedisStorage<DuelSession>,
		private random: RandomService,
	) {}

	async duel(firstId: Numeric, secondId: Numeric) {
		const [winnerId, loserId] = this.random.shuffle([firstId, secondId])

		const firstDefeated = await this.storage
			.get({ id: firstId })
			.then(prop("defeated"))
		if (firstDefeated) {
			return { firstDelay: await this.storage.getTTL(firstId) }
		}

		const secondDefeated = await this.storage
			.get({ id: secondId })
			.then(prop("defeated"))
		if (secondDefeated) {
			return { secondDelay: await this.storage.getTTL(secondId) }
		}

		if (this.random.bool(0.4)) {
			// draw
			const first = await this.prisma.user.findUniqueOrThrow({
				where: { id: firstId },
			})
			const second = await this.prisma.user.findUniqueOrThrow({
				where: { id: secondId },
			})
			return { first, second }
		}

		await this.storage.upsert({
			id: loserId,
			create: { defeated: true, expire: DELAY },
		})
		const [winner, loser] = await this.prisma.$transaction([
			this.prisma.user.update({
				where: { id: winnerId },
				data: {
					duelWins: { increment: 1 },
					duelTotal: { increment: 1 },
				},
			}),
			this.prisma.user.update({
				where: { id: loserId },
				data: {
					duelTotal: { increment: 1 },
				},
			}),
		])

		const [first, second] =
			firstId === winnerId ? [winner, loser] : [loser, winner]

		return { first, second, winner, loser }
	}
}
