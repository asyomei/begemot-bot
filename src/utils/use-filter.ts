import { MiddlewareFn } from "grammy"
import { MyContext } from "#/types/context"

export function useFilter<C extends MyContext>(
	pred: (ctx: C) => boolean | Promise<boolean>,
): MiddlewareFn<C> {
	return async (ctx, next) => {
		if (await pred(ctx)) {
			await next()
		}
	}
}
