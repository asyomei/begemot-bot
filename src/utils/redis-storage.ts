import { isNil, omit, omitBy } from "lodash"

export interface RedisClient {
	get(key: string): Promise<string | null | undefined>
	set(
		key: string,
		value: string,
		options: { KEEPTTL: true } | { EX: number },
	): Promise<unknown>
	expire(key: string, seconds: number): Promise<boolean>
	ttl(key: string): Promise<number>
}

export type Expire = { expire?: number }

export class RedisStorage<T extends { [x: string]: any }> {
	constructor(
		readonly name: string,
		private redis: RedisClient,
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
				...omit(omitBy(args.update, isNil), ["expire"]),
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
			...omit(omitBy(args.data, isNil), ["expire"]),
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
