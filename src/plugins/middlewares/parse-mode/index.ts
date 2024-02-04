import { Context, NextFunction, Transformer } from "grammy"

export default async (ctx: Context, next: NextFunction) => {
	ctx.api.config.use(transformer)

	await next()
}

const transformer: Transformer = async (prev, method, payload, signal) => {
	if (method.startsWith("send") && method !== "sendChatAction") {
		payload = { parse_mode: "HTML", ...payload }
	}

	return await prev(method, payload, signal)
}
