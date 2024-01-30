import { Lang, tr } from "#/utils/i18n"
import { MemoryService } from "./service"

export interface MemoryControllerDeps {
	service: MemoryService
}

export class MemoryController {
	constructor(private deps: MemoryControllerDeps) {}

	memory(lng: Lang) {
		const memory = Number(this.deps.service.getMemoryMB().toFixed(2))

		return tr(lng, "memory.text", { memory })
	}
}
