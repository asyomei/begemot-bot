import { Context, NextFunction, Transformer } from "grammy"

export function fromTransformer(transformer: Transformer) {
	return (ctx: Context, next: NextFunction) => {
		ctx.api.config.use(transformer)
		return next()
	}
}
