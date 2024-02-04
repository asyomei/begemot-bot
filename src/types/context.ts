import { Context } from "grammy"
import { Lang, TOptions } from "#/utils/i18n"
import { Resource } from "#/utils/i18n/types"

export type MyContext = Context & I18nFlavor

export interface I18nFlavor {
	i18n: {
		lng: Lang
		t(path: string | string[], opts?: TOptions): string
		res(path: string | string[], opts?: TOptions): Resource | null | undefined
	}
}
