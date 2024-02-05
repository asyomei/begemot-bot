export class RandomService {
	/**
	 * Get a random float in range [start..end)
	 * when only start, then random float in range [0..start)
	 * when no arguments, then random float in range [0..1)
	 */
	float(start?: number, end?: number): number {
		if (start == null) {
			return Math.random()
		}

		if (end == null) {
			return Math.random() * start
		}

		return Math.random() * (end - start) + start
	}

	/**
	 * Get a random int in range [start..end)
	 * when only start, then random int in range [0..start)
	 */
	int(start: number, end?: number): number {
		return Math.trunc(this.float(start, end))
	}

	/**
	 * Get a random int in range [start..end]
	 * when only start, then random int in range [0..start]
	 */
	inti(start: number, end?: number): number {
		if (end == null) {
			return this.int(start + 1)
		}

		return this.int(start, end + 1)
	}

	/** Get a random item from arraylike object */
	choice<T>(arr: ArrayLike<T>): T {
		const idx = this.int(arr.length)

		return arr[idx]!
	}

	/** Shuffle array */
	shuffle<A extends any[]>(arr: A, copy = false): A {
		if (copy) {
			return this.shuffle(arr.slice()) as A
		}

		for (let i = arr.length - 1; i > 0; i--) {
			const j = this.inti(i)
			;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
		}

		return arr
	}

	/**
	 * Get a random bool with chance
	 * @param chance Custom chance [0..1] (default: 0.5)
	 */
	bool(chance = 0.5): boolean {
		return this.float() < chance
	}
}
