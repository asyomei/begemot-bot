import { InlineKeyboard } from "grammy"
import { InlineKeyboardButton } from "grammy/types"
import { CallbackData } from "#/utils/callback-data"
import { languages, tr } from "#/utils/i18n"
import { LanguageService } from "./service"

export class LanguageController {
	constructor(private service: LanguageService) {}

	language(userId: number, curLng: string): [string, InlineKeyboardButton[][]] {
		const buttons = languages.map((lng) => [
			InlineKeyboard.text(
				(curLng === lng ? "✅ " : "") + tr(lng, "language.flag-name"),
				this.cbData.pack({ lng }, [userId]),
			),
		])

		return [tr("en", "language.choose"), buttons]
	}

	async changeLanguage(userId: number, lng: string) {
		await this.service.changeLanguage(userId, lng)

		return tr(lng, "language.changed")
	}

	cbData = new CallbackData("language", "private", { lng: String })
}
