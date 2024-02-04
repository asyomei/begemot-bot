export const MAX_ATTEMPTS = 5
export const DELAY = 3 * 60 * 60 // hours

export const ROW = 5
export const CLOSED_ITEM = "📦"
export const ITEMS = [
	..."🪙".repeat(14),
	..."💰".repeat(6),
	..."💵".repeat(4),
	"💎",
]

export const ITEM_INCOMES: Record<string, [number, number]> = {
	"🪙": [50, 300],
	"💰": [300, 1200],
	"💵": [1200, 3000],
	"💎": [3000, 5000],
}
