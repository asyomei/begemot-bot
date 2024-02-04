import { ValueOf } from "#/types/value-of"
import { Lang, TOptions, tr } from "#/utils/i18n"

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
	ValueOf<TOptions>
>

export class ProfileTemplate {
	name(lng: Lang, template: string) {
		return tr(lng, ["profiles", template, "name"])
	}

	user(lng: Lang, template: string, opts: UserTOptions) {
		return tr(lng, ["profiles", template, "user"], opts)
	}
}
