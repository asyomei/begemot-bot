import { PropertyPath, mapValues, random, sample } from "lodash"
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
const randomFox = () => json("https://randomfox.ca/floof/", "image")
const randomDog = () => json("https://random.dog/woof.json", "url")
const randomDuck = () => json("https://random-d.uk/api/v2/random", "url")
const shibuOnline = () => json("https://shibe.online/api/shibes", "0")
const animality = (type: string) =>
	json(`https://api.animality.xyz/img/${type}`, "image")

export const END_POINTS: Record<string, (() => Promise<string>)[]> = {
	cat: [nekosLife("meow"), animality("cat")],
	dog: [nekosLife("woof"), randomDog(), shibuOnline(), animality("dog")],
	fox: [randomFox(), animality("fox")],
	bird: [animality("bird")],
	panda: [animality("panda"), animality("redpanda")],
	koala: [animality("koala")],
	whale: [animality("whale")],
	dolphin: [animality("dolphin")],
	kangaroo: [animality("kangaroo")],
	rabbit: [animality("rabbit")],
	lion: [animality("lion")],
	bear: [animality("bear")],
	frog: [animality("frog")],
	duck: [randomDuck(), animality("duck")],
	penguin: [animality("penguin")],
	axolotl: [animality("axolotl")],
	capybara: [animality("capybara")],
	hedgehog: [animality("hedgehog")],
	turtle: [animality("turtle")],
	narwhal: [animality("narwhal")],
	squirrel: [animality("squirrel")],
	fish: [animality("fish")],
	horse: [animality("horse")],
	goose: [nekosLife("goose")],
	lizard: [nekosLife("lizard")],
}
