import { adminHelpText } from "#/consts/help-text"
import { Lang } from "#/utils/i18n"

export class AdminHelpController {
	help(lng: Lang) {
		return adminHelpText(lng)
	}
}
