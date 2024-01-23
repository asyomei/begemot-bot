import { StartComposer } from "./composer"
import { StartController } from "./controller"

export default new StartComposer({
	controller: new StartController(),
})
