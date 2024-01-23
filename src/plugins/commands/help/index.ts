import { HelpComposer } from "./composer"
import { HelpController } from "./controller"

export default new HelpComposer({
	controller: new HelpController(),
})
