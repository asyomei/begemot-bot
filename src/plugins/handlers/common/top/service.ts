import { PrismaClient } from "@prisma/client"
import { ITEMS_ON_PAGE } from "./consts"

type PickPrisma = Pick<PrismaClient, "user">

export class TopService {
	constructor(private prisma: PickPrisma) {}

	async getUserTop(field: string, page: number) {
		return await this.prisma.user.findMany({
			orderBy: { [field]: "desc" },
			skip: page * ITEMS_ON_PAGE,
			take: ITEMS_ON_PAGE,
		})
	}
}
