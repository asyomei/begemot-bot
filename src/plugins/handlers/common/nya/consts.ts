import { PropertyPath, mapValues } from "lodash"
import { prop } from "lodash/fp"

const json = (url: string, path: PropertyPath, query?: any) => () => {
	if (query) {
		url += `?${new URLSearchParams(mapValues(query, String))}`
	}
	return fetch(url)
		.then((res) => res.json())
		.then(prop(path))
}

const nekosLife = (type: string) =>
	json(`https://nekos.life/api/v2/img/${type}`, "url")
const nekosBest = (type: string) =>
	json(`https://nekos.best/api/v2/${type}`, "results[0].url")
const waifuPics = (mode: string, type: string) =>
	json(`https://api.waifu.pics/${mode}/${type}`, "url")
const hmtai = (type: string) =>
	json(`https://hmtai.hatsunia.cfd/v2/${type}`, "url")
const waifuIm = (mode: string, type: string) =>
	json("https://api.waifu.im/search", "images[0].url", {
		is_nsfw: mode === "nsfw",
		included_tags: type,
	})

export const END_POINTS: Record<
	"sfw" | "nsfw",
	Record<string, (() => Promise<string>)[]>
> = {
	sfw: {
		neko: [
			nekosLife("neko"),
			nekosBest("neko"),
			waifuPics("sfw", "neko"),
			hmtai("neko_arts"),
		],
		kitsune: [nekosLife("fox_girl"), nekosBest("kitsune")],
		okami: [waifuPics("sfw", "awoo"), hmtai("wolf_arts")],
		waifu: [
			nekosBest("waifu"),
			waifuPics("sfw", "waifu"),
			waifuIm("nsfw", "waifu"),
		],
		cuddle: [waifuPics("sfw", "cuddle"), hmtai("cuddle")],
		kiss: [waifuPics("sfw", "kiss"), hmtai("kiss")],
		pat: [waifuPics("sfw", "pat"), hmtai("pat")],
		smile: [waifuPics("sfw", "smile"), hmtai("smile")],
		bite: [waifuPics("sfw", "bite"), hmtai("bite")],
		kill: [waifuPics("sfw", "kill"), hmtai("kill")],
	},
	nsfw: {
		neko: [waifuPics("nsfw", "neko"), hmtai("nsfwNeko")],
		waifu: [waifuPics("nsfw", "waifu"), waifuIm("nsfw", "waifu")],
		pussy: [hmtai("pussy")],
		masturbation: [hmtai("masturbation")],
		yuri: [hmtai("yuri")],
		trap: [waifuPics("nsfw", "trap")],
		tentacles: [hmtai("tentacles")],
	},
}
