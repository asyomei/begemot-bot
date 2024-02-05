import { Prisma } from "@prisma/client"
import { ProfileTemplate } from "#/services/profile-template"
import { Numeric } from "#/types/numeric"
import { fullName } from "#/utils/full-name"
import { Lang } from "#/utils/i18n"

export class ProfileService {
	constructor(
		private prismaUser: Prisma.UserDelegate,
		private template: ProfileTemplate,
	) {}

	async getProfile(lng: Lang, userId: Numeric) {
		const user = await this.prismaUser.findUniqueOrThrow({
			where: { id: userId },
		})

		return this.template.user(lng, user.profileTemplate, {
			name: fullName(user),
			vipStatus: "TODO",
			messages: user.messages,
			messagesToRankUp: "TODO",
			rank: "TODO",
			rating: user.rating,
			coins: user.coins,
			duelTotal: user.duelTotal,
			duelWins: user.duelWins,
			placeLabel: "TODO",
		})
	}
}
