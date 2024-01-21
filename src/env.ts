import "dotenv/config"
import { cleanEnv, str } from "envalid"

export const env = cleanEnv(process.env, {
	BOT_TOKEN: str({ desc: "Bot token from @BotFather" }),
	DATABASE_URL: str({ desc: "Database url" }),
})
