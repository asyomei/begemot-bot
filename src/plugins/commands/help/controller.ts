import { helpText } from "#/consts/help-text"
import { Lang } from "#/utils/i18n"

export class HelpController {
	help(lng: Lang) {
		return helpText(lng)
	}
}
