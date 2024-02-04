import { MemoryController } from "./controller"
import { MemoryService } from "./service"

export default new MemoryController(new MemoryService())
