import { NextFunction } from "grammy"
import { MyContext } from "../../types/context"
import { I18n, i18n } from "../../utils/i18n"

export default async (ctx: MyContext, next: NextFunction) => {
	if (!ctx.from) {
		ctx.i18n = i18n
		return await next()
	}

	ctx.i18n = new I18n(ctx.from.language_code)

	await next()
}
