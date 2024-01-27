import { Context, NextFunction } from "grammy"

export default (ctx: Context, next: NextFunction) => {
	if (ctx.msg?.sender_chat) return
	if (ctx.msg?.reply_to_message?.sender_chat) return

	return next()
}
