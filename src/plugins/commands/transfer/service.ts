import { Prisma, PrismaClient } from "@prisma/client"
import { trimStart } from "lodash"
import { Numeric } from "#/types/numeric"

export interface TransferServiceDeps {
	prismaTransaction: PrismaClient["$transaction"]
	prismaUser: Prisma.UserDelegate
}

export class TransferService {
	constructor(private deps: TransferServiceDeps) {}

	async getUserId(key: string | Numeric) {
		if (typeof key !== "string") return key

		const id = Number(key)
		if (!Number.isNaN(id)) return id

		const user = await this.deps.prismaUser.findUnique({
			select: { id: true },
			where: { username: trimStart(key, "@") },
		})
		return user?.id
	}

	async getCoins(userId: Numeric) {
		const user = await this.deps.prismaUser.findUniqueOrThrow({
			select: { coins: true },
			where: { id: userId },
		})

		return user.coins
	}

	async transfer(fromId: Numeric, toId: Numeric, amount: bigint) {
		const coins = await this.getCoins(fromId)
		if (coins < amount) {
			throw new Error(
				`fromUser.coins [${coins}] < amount [${amount}], so transfer couldn't be completed`,
			)
		}

		const [from, to] = await this.deps.prismaTransaction([
			this.deps.prismaUser.update({
				where: { id: fromId },
				data: { coins: { decrement: amount } },
			}),
			this.deps.prismaUser.update({
				where: { id: toId },
				data: { coins: { increment: amount } },
			}),
		])

		return { from, to }
	}
}
