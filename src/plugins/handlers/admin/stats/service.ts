import { PrismaClient } from "@prisma/client"

type PickPrisma = Pick<PrismaClient, "user">

export class StatsService {
	constructor(private prisma: PickPrisma) {}

	async countUsers() {
		return await this.prisma.user.count({ where: { isBot: false } })
	}
}
