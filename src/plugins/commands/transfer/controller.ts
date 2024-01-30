import { Numeric } from "#/types/numeric"
import { escapeHTML } from "#/utils/escape-html"
import { fullName } from "#/utils/full-name"
import { Lang, tr } from "#/utils/i18n"
import { TransferService } from "./service"

export interface TransferControllerDeps {
	service: TransferService
}

export class TransferController {
	constructor(private deps: TransferControllerDeps) {}

	async transfer(
		lng: Lang,
		fromId: Numeric,
		toKey: string | Numeric,
		amount: bigint,
	) {
		const toId = await this.deps.service.getUserId(toKey)
		if (!toId) {
			return tr(lng, "transfer.missing-user")
		}
		if (BigInt(fromId) === BigInt(toId)) return

		const fromCoins = await this.deps.service.getCoins(fromId)
		if (fromCoins < amount) {
			return tr(lng, "transfer.not-enough", {
				amount,
				coins: fromCoins,
			})
		}

		const { from, to } = await this.deps.service.transfer(fromId, toId, amount)
		console.log({ fromId, toId, from, to, amount })
		return tr(lng, "transfer.complete", {
			amount,
			fromName: escapeHTML(from.firstName),
			toName: escapeHTML(to.firstName),
			fromCoins: from.coins,
			toCoins: to.coins,
		})
	}
}
