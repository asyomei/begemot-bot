import { limit } from "@grammyjs/ratelimiter"
import { Composer, Context } from "grammy"
import { redis } from "#/redis"

const redisClient = {
	incr: (key: string) => redis.incr(key),
	pexpire: (key: string, ms: number) => redis.pExpire(key, ms).then(Number),
}

const onLimitExceeded = (ctx: Context) =>
	ctx.callbackQuery && ctx.answerCallbackQuery()

const composer = new Composer(
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

export default composer
