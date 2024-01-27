import { Lang, tr } from "#/utils/i18n"
import { StatsService } from "./service"

export interface StatsControllerDeps {
	service: StatsService
}

export class StatsController {
	constructor(private deps: StatsControllerDeps) {}

	async stats(lng: Lang) {
		const users = await this.deps.service.countUsers()

		return tr(lng, "stats.text", { users })
	}
}
