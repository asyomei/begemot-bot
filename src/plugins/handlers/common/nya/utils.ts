import { sample, shuffle } from "lodash"
import { Lang, getI18nResource, languages } from "#/utils/i18n"
import { END_POINTS } from "./consts"

export async function getImageUrl(mode: "sfw" | "nsfw", type: string) {
	const endPoints = END_POINTS[mode][type]!

	for (const getUrl of shuffle(endPoints)) {
		const url = await getUrl().catch(() => null)
		if (url) return url
	}
}

export function getHelp(lng: Lang, mode: "sfw" | "nsfw") {
	const types = Object.keys(END_POINTS[mode])

	return (
		(mode === "nsfw" ? "[NSFW]\n" : "") +
		types
			.map((type) => {
				const names = getI18nResource(lng, ["nya.types", type]) as string[]
				return `- ${names.join(", ")}`
			})
			.join("\n")
	)
}

export function getRandomType(mode: "sfw" | "nsfw"): string {
	return sample(Object.keys(END_POINTS[mode]))!
}

export function getType(match: string): string | undefined {
	match = match.trim().toLowerCase()

	for (const lng of languages) {
		for (const [type, names] of Object.entries(getTypes(lng))) {
			if (names.includes(match)) return type
		}
	}
}

export function getName(lng: Lang, searchType: string): string | undefined {
	for (const [type, names] of Object.entries(getTypes(lng))) {
		if (type === searchType) return names.join(", ")
	}
}

const getTypes = (lng: Lang) =>
	getI18nResource(lng, "nya.types") as Record<string, string[]>
