import { Context } from "grammy"
import { i18n } from "../utils/i18n"

export type MyContext = Context & I18nFlavor

export interface I18nFlavor {
	i18n: typeof i18n
}
