import { User } from "grammy/types"
import { MyContext } from "#/types/context"

export interface HasReplyUserFiltered {
	replyUser: User
}

export function hasReplyUser<C extends MyContext>(
	ctx: C,
): ctx is C & HasReplyUserFiltered {
	const user = getReplyUser(ctx)
	if (user) (ctx as C & HasReplyUserFiltered).replyUser = user
	return !!user
}

export function getReplyUser(ctx: MyContext) {
	return ctx.msg?.reply_to_message?.from
}
