import { PrismaClient, User } from "@prisma/client"
import { Numeric } from "#/types/numeric"

type PrismaPicked = Pick<PrismaClient, "$transaction" | "user">

export class TransferService {
	constructor(private prisma: PrismaPicked) {}

	async transfer(
		fromId: Numeric,
		toKey: Numeric | string,
		amount: bigint,
	): Promise<null | { coins: bigint } | { from: User; to: User }> {
		const toId = await this.getUserId(toKey)
		if (!toId || BigInt(fromId) === toId) return null

		const { coins: fromCoins } = await this.prisma.user.findUniqueOrThrow({
			where: { id: fromId },
			select: { coins: true },
		})

		if (fromCoins < amount) return { coins: fromCoins }

		const [from, to] = await this.prisma.$transaction([
			this.prisma.user.update({
				where: { id: fromId },
				data: { coins: { decrement: amount } },
			}),
			this.prisma.user.update({
				where: { id: toId },
				data: { coins: { increment: amount } },
			}),
		])

		return { from, to }
	}

	private async getUserId(key: string | Numeric) {
		const where =
			typeof key !== "string"
				? { id: key }
				: !Number.isNaN(Number(key))
				  ? { id: Number(key) }
				  : { username: key }

		const user = await this.prisma.user.findUnique({
			where,
			select: { id: true },
		})

		return user?.id
	}
}
