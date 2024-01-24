import { Numeric } from "#/types/numeric"
import { Lang, tr } from "#/utils/i18n"
import { RatingService } from "./service"

export interface RatingControllerDeps {
	service: RatingService
}

export class RatingController {
	constructor(private deps: RatingControllerDeps) {}

	async rating(lng: Lang, fromId: Numeric, toId: Numeric, value: number) {
		const info = await this.deps.service.getRatingInfo(fromId)
		if (info) return tr(lng, "rating.delay")

		await this.deps.service.setRatingInfo(fromId, value)
		const { rating } = await this.deps.service.changeRating(toId, value)

		return tr(lng, "rating.changed", {
			rating,
			name: await this.deps.service.getFullName(toId),
		})
	}
}
