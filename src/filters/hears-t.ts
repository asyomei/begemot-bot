import { memoize } from "lodash"
import { MyContext } from "#/types/context"
import { I18nNotFoundError, getI18nResource, languages } from "#/utils/i18n"

export interface HearsTFiltered {
	triggerArgs: string[]
}

export function hearsT(
	key: string | string[],
	check?: (text: string, trigger: string) => string[] | undefined,
) {
	check ??= (text, trigger) =>
		text.toLowerCase() === trigger.toLowerCase() ? [] : undefined

	return <C extends MyContext>(ctx: C): ctx is C & HearsTFiltered => {
		const text = ctx.msg?.text
		if (!text) return false

		const triggers = getTriggers(key)

		if (triggers.length === 0) {
			throw new I18nNotFoundError("all", key, "triggers")
		}

		for (const trigger of triggers) {
			const args = check!(text, trigger)
			if (!args) continue
			;(ctx as C & HearsTFiltered).triggerArgs = args
			return true
		}

		return false
	}
}

const getTriggers = memoize((key: string | string[]) => {
	return languages.flatMap((lng) => {
		const triggers = getI18nResource(lng, key)
		return Array.isArray(triggers) ? triggers : []
	})
})
