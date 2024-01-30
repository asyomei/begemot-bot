import { Prisma } from "@prisma/client"
import { Numeric } from "#/types/numeric"

export interface ProfileServiceDeps {
	prismaUser: Prisma.UserDelegate
}

export class ProfileService {
	constructor(private deps: ProfileServiceDeps) {}

	async getUser(userId: Numeric) {
		return await this.deps.prismaUser.findUniqueOrThrow({
			where: { id: userId },
		})
	}
}
