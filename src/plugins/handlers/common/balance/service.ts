import { Prisma } from "@prisma/client"
import { Numeric } from "#/types/numeric"

export class BalanceService {
	constructor(private prismaUser: Prisma.UserDelegate) {}

	async getBalance(userId: Numeric) {
		const user = await this.prismaUser.findUniqueOrThrow({
			where: { id: userId },
			select: { coins: true },
		})

		return user.coins
	}
}
