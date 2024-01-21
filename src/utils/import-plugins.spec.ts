import { Composer } from "grammy"
import { importPlugins } from "./import-plugins"

test("importPlugins", async () => {
	const comp = await importPlugins()

	expect(comp).toBeInstanceOf(Composer)
})
