import { InlineKeyboard } from "grammy"
import { InlineKeyboardButton } from "grammy/types"
import { RandomService } from "#/services/random"
import { CallbackData } from "#/utils/callback-data"
import { chunk } from "#/utils/chunk"
import { Lang, tr } from "#/utils/i18n"
import {
	CLOSED_ITEM,
	DELAY,
	ITEMS,
	ITEM_INCOMES,
	MAX_ATTEMPTS,
	ROW,
} from "./consts"
import { BonusService } from "./service"

export interface BonusControllerDeps {
	service: BonusService
	random: RandomService
}

export class BonusController {
	constructor(private deps: BonusControllerDeps) {}

	async bonus(
		userId: number,
		lng: Lang,
	): Promise<[string, InlineKeyboardButton[][]?]> {
		const session = await this.deps.service.getSession(userId, {
			attempts: MAX_ATTEMPTS,
			items: this.deps.random.shuffle(ITEMS, true),
			opened: [],
			lastIncome: 0,
			incomeTotal: 0,
			expire: DELAY,
		})

		if (session.attempts <= 0) {
			const ttl = await this.deps.service.getTTL(userId)
			return [tr(lng, "bonus.delay", { delay: ttl })]
		}

		return [
			await this.getText(
				lng,
				userId,
				session.attempts,
				session.lastIncome,
				session.incomeTotal,
			),
			this.makeField(userId, session.items, session.opened),
		]
	}

	async bonusField(
		userId: number,
		pos: number,
		lng: Lang,
	): Promise<[string, InlineKeyboardButton[][]?]> {
		const session = await this.deps.service.getSession(userId)
		if (!session || session.attempts <= 0) {
			return [tr(lng, "bonus.no-attempts")]
		}

		if (session.opened.includes(pos)) {
			return [tr(lng, "bonus.already-opened")]
		}

		const income = this.getIncome(session.items[pos]!)
		session.attempts--
		session.opened.push(pos)
		session.lastIncome = income
		session.incomeTotal += income

		await this.deps.service.addCoins(userId, income)
		await this.deps.service.updateSession(userId, session)

		return [
			await this.getText(
				lng,
				userId,
				session.attempts,
				session.lastIncome,
				session.incomeTotal,
			),
			this.makeField(userId, session.items, session.opened),
		]
	}

	private getIncome(item: string): number {
		const range = ITEM_INCOMES[item] ?? [100, 100]
		return this.deps.random.inti(...range)
	}

	private async getText(
		lng: Lang,
		userId: number,
		attempts: number,
		lastIncome: number,
		incomeTotal: number,
	) {
		return tr(lng, "bonus.text", {
			attempts,
			lastIncome,
			incomeTotal,
			name: await this.deps.service.getUserFullname(userId),
		})
	}

	private makeField(
		userId: number | bigint,
		items: string[],
		opened: number[],
	): InlineKeyboardButton[][] {
		const buttons = items.map((item, i) =>
			InlineKeyboard.text(
				opened.includes(i) ? item : CLOSED_ITEM,
				this.cbData.pack({ pos: i }, [userId]),
			),
		)

		return chunk(buttons, ROW)
	}

	cbData = new CallbackData("bonus", "private", { pos: Number })
}
