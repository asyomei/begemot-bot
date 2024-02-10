import { redis } from "#/redis"
import { RedisStorage } from "#/utils/redis-storage"
import { NyaController } from "./controller"
import { NyaService } from "./service"

export default new NyaController(new NyaService(new RedisStorage("nya", redis)))
