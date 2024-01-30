export class MemoryService {
	getMemoryMB() {
		return process.memoryUsage().heapUsed / 1024 / 1024
	}
}
