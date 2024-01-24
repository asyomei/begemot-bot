import { createClient } from "redis"
import { env } from "./env"

export type Redis = typeof redis

export const redis = createClient({ url: env.REDIS_URL })
