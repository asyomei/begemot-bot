import { MemoryComposer } from "./composer"
import { MemoryController } from "./controller"
import { MemoryService } from "./service"

export default new MemoryComposer({
	controller: new MemoryController({
		service: new MemoryService(),
	}),
})
