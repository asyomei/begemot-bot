import { AdminHelpComposer } from "./composer"
import { AdminHelpController } from "./controller"

export default new AdminHelpComposer({
	controller: new AdminHelpController(),
})
