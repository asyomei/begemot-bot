import { ProfileTemplate } from "#/services/profile-template"
import { Numeric } from "#/types/numeric"
import { fullName } from "#/utils/full-name"
import { Lang } from "#/utils/i18n"
import { ProfileService } from "./service"

export interface ProfileControllerDeps {
	service: ProfileService
	template: ProfileTemplate
}

export class ProfileController {
	constructor(private deps: ProfileControllerDeps) {}

	async userProfile(lng: Lang, userId: Numeric) {
		const user = await this.deps.service.getUser(userId)

		return this.deps.template.user(lng, user.profileTemplate, {
			name: fullName(user.firstName, user.lastName),
			vipStatus: "TODO",
			messages: user.messages,
			messagesToRankUp: "TODO",
			rank: "TODO",
			rating: user.rating,
			coins: user.coins,
			duelWins: "TODO",
			duelTotal: "TODO",
			placeLabel: "TODO",
		})
	}
}
