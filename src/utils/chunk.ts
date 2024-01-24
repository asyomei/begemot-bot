export function chunk<T>(arr: T[], size: number): T[][] {
	const newArr: T[][] = []

	for (let i = 0; i < arr.length; i += size) {
		const row: T[] = []

		for (let j = 0; j < size; j++) {
			if (i + j >= arr.length) break
			row.push(arr[i + j]!)
		}

		newArr.push(row)
	}

	return newArr
}
