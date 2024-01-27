import { limit } from "@grammyjs/ratelimiter"
import { Composer } from "grammy"
import { redis } from "#/redis"
import { MyContext } from "#/types/context"

const redisClient = {
	incr: (key: string) => redis.incr(key),
	pexpire: (key: string, ms: number) => redis.pExpire(key, ms).then(Number),
}

const onLimitExceeded = (ctx: MyContext) =>
	ctx.callbackQuery && ctx.answerCallbackQuery()

const comp = new Composer()
export default comp

comp.use(
	// for users
	limit({
		onLimitExceeded,
		keyGenerator: (ctx) => ctx.from && `u${ctx.from.id}`,
		storageClient: redisClient,
	}),
	// for chats
	limit({
		limit: 5,
		timeFrame: 1500,
		onLimitExceeded,
		keyGenerator: (ctx) => ctx.chat && `c${ctx.chat.id}`,
		storageClient: redisClient,
	}),
)
