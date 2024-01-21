import { Context } from "grammy"
import { Lang } from "../utils/i18n"

export type MyContext = Context & LangFlavor

export interface LangFlavor {
	lng?: Lang
}
