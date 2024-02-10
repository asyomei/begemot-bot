import { Numeric } from "#/types/numeric"
import { RedisStorage } from "#/utils/redis-storage"
import { NyaSession } from "./session.type"

export class NyaService {
	constructor(private storage: RedisStorage<NyaSession>) {}

	async getMode(userId: Numeric) {
		const session = await this.storage.upsert({
			id: userId,
			create: { mode: "sfw" },
		})

		return session.mode
	}

	async changeMode(userId: Numeric, mode: "sfw" | "nsfw") {
		await this.storage.upsert({
			id: userId,
			create: { mode },
			update: { mode },
		})
	}
}
