import { Lang, tr } from "#/utils/i18n"
import { BalanceService } from "./service"

export interface BalanceControllerDeps {
	service: BalanceService
}

export class BalanceController {
	constructor(private deps: BalanceControllerDeps) {}

	async getBalance(userId: number | bigint, lng: Lang) {
		const coins = await this.deps.service.getBalance(userId)

		return tr(lng, "balance.text", { coins })
	}
}
