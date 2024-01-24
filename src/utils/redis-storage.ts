import { Redis } from "#/redis"
import { compactStrict } from "#/utils/compact"
import { omit } from "#/utils/omit"

export type Expire = { expire?: number }

export class RedisStorage<T extends { [x: string]: any }> {
	constructor(
		readonly name: string,
		private redis: Redis,
	) {}

	async get(args: {
		id: number | bigint | string
	}): Promise<T | null> {
		const source = await this.redis.get(this.getKey(args.id))
		if (!source) return null

		return JSON.parse(source)
	}

	async upsert(args: {
		id: number | bigint | string
		create: T & Expire
		update?: Partial<T> & Expire
	}): Promise<T> {
		const session = await this.get(args)

		let expire: number | undefined
		let data: T

		if (session) {
			if (!args.update) return session
			expire = args.update.expire
			data = {
				...(session as T),
				...omit(compactStrict(args.update), ["expire"]),
			}
		} else {
			expire = args.create.expire
			data = omit(args.create, ["expire"]) as T
		}

		return await this.set(args.id, data, expire)
	}

	async update(args: {
		id: number | bigint | string
		data: Partial<T> & Expire
	}): Promise<T> {
		const source = await this.redis.get(this.getKey(args.id))
		if (!source) {
			throw new Error(`Redis session "${this.getKey(args.id)}" not found`)
		}

		const expire = args.data.expire
		const data = {
			...(JSON.parse(source) as T),
			...omit(compactStrict(args.data), ["expire"]),
		}

		return await this.set(args.id, data, expire)
	}

	async getTTL(id: number | bigint | string): Promise<number | undefined> {
		const ttl = await this.redis.ttl(this.getKey(id))
		return ttl >= 0 ? ttl : undefined
	}

	async setTTL(id: number | bigint | string, expire: number): Promise<boolean> {
		return await this.redis.expire(this.getKey(id), expire)
	}

	private async set(id: number | bigint | string, data: T, expire?: number) {
		await this.redis.set(
			this.getKey(id),
			JSON.stringify(data),
			expire ? { EX: expire } : { KEEPTTL: true },
		)
		return data
	}

	private getKey(id: number | bigint | string): string {
		return `${this.name}-session:${id}`
	}
}
