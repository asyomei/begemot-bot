import { NextFunction } from "grammy"
import { ReplyParameters } from "grammy/types"
import { MyContext } from "#/types/context"

export const autoReply = async <C extends MyContext>(
	ctx: C,
	next: NextFunction,
) => {
	ctx.api.config.use(async (prev, method, payload, signal) => {
		if (!(method.startsWith("send") && method !== "sendChatAction")) {
			return await prev(method, payload, signal)
		}

		const params: ReplyParameters | undefined = ctx.msg && {
			message_id: ctx.msg.message_id,
			allow_sending_without_reply: true,
		}

		return await prev(method, { reply_parameters: params, ...payload }, signal)
	})

	await next()
}
