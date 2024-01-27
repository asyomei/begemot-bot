import "dotenv/config"
import { EnvError, cleanEnv, makeValidator, str } from "envalid"

const nums = makeValidator((input) => {
	const nums = input.split(/\s+/g).filter(Boolean).map(Number)
	if (nums.some(Number.isNaN)) {
		throw new EnvError(`Invalid numbers: "${nums.join(" ")}"`)
	}

	return nums
})

export const env = cleanEnv(process.env, {
	BOT_TOKEN: str({ desc: "Bot token from @BotFather" }),
	SUPER_ADMINS: nums({ desc: "Super admin ids" }),
	DATABASE_URL: str({ desc: "Database url" }),
	REDIS_URL: str({ desc: "Redis url" }),
})
