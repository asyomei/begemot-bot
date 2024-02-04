import { mapValues } from "lodash"
import { isString } from "lodash/fp"
import { escapeHTML } from "#/utils/escape-html"
import { Lang, TOptionValue, tr } from "#/utils/i18n"
import { when } from "#/utils/misc"

export type UserTOptions = Record<
	| "name"
	| "vipStatus"
	| "messages"
	| "messagesToRankUp"
	| "rank"
	| "rating"
	| "coins"
	| "duelWins"
	| "duelTotal"
	| "placeLabel",
	TOptionValue
>

export class ProfileTemplate {
	name(lng: Lang, template: string) {
		return tr(lng, ["profiles", template, "name"])
	}

	user(lng: Lang, template: string, opts: UserTOptions) {
		const escapedOpts = mapValues(opts, when(isString, escapeHTML))
		return tr(lng, ["profiles", template, "user"], escapedOpts)
	}
}
