import { User } from "grammy/types"
import { MyContext } from "#/types/context"

export interface HasReplyUserFiltered {
	replyUser: User
}

export function hasReplyUser<C extends MyContext>(
	ctx: C,
): ctx is C & HasReplyUserFiltered {
	const user = ctx.msg?.reply_to_message?.from
	if (user) (ctx as C & HasReplyUserFiltered).replyUser = user
	return !!user
}
