import { MiddlewareFn } from "grammy"
import { MyContext } from "../../types/context"

interface CustomComposer<C extends MyContext> {
	middleware(): MiddlewareFn<C>
}

export function fromComposer<C extends MyContext>(
	factory: () => CustomComposer<C>,
): MiddlewareFn<C> {
	return (ctx, next) => factory().middleware()(ctx, next)
}

export function compMiddleware<C extends MyContext>(
	comp: CustomComposer<C>,
): () => MiddlewareFn<C> {
	return comp.middleware.bind(comp)
}
