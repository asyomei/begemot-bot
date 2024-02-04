import { NextFunction } from "grammy"
import { prisma } from "#/prisma"
import { MyContext } from "#/types/context"
import { getI18nResource, tr } from "#/utils/i18n"
import { getLanguage } from "./get-language"

export default async (ctx: MyContext, next: NextFunction) => {
	if (!ctx.from) return await next()

	const lng = await getLanguage(prisma.user, ctx.from)

	ctx.i18n = {
		lng,
		t: (path, opts) => tr(ctx.i18n.lng, path, opts),
		res: (path, opts) => getI18nResource(ctx.i18n.lng, path, opts),
	}

	await next()
}
