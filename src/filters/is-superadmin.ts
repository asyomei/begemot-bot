import { Context } from "grammy"
import { env } from "#/env"

export function isSuperadmin(ctx: Context): boolean {
	if (!ctx.from) return false

	return env.SUPER_ADMINS.includes(ctx.from.id)
}
