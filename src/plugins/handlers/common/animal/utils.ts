import { shuffle } from "lodash"
import { END_POINTS } from "./consts"

export async function getImageUrl(animal: string) {
	for (const getUrl of shuffle(END_POINTS[animal])) {
		const url = await getUrl().catch(() => null)
		if (url) return url
	}
}
