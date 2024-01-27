import { Prisma } from "@prisma/client"

export interface StatsServiceDeps {
	prismaUser: Prisma.UserDelegate
}

export class StatsService {
	constructor(private deps: StatsServiceDeps) {}

	async countUsers() {
		return await this.deps.prismaUser.count({
			where: { isBot: false },
		})
	}
}
