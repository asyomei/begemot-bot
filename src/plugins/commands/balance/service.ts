import { Prisma } from "@prisma/client"

export interface BalanceServiceDeps {
	prismaUser: Prisma.UserDelegate
}

export class BalanceService {
	constructor(private deps: BalanceServiceDeps) {}

	async getBalance(userId: number | bigint) {
		const user = await this.deps.prismaUser.findUniqueOrThrow({
			where: { id: userId },
			select: { coins: true },
		})

		return user.coins
	}
}
