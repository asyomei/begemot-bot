import { Lang, tr } from "#/utils/i18n"

export class StartController {
	start(lng: Lang) {
		return tr(lng, "start.text")
	}
}
