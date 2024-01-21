import { helpText } from "#/consts/help-text"
import { languages } from "./i18n"

test("helpText", () => {
	for (const lng of languages) {
		expect(helpText(lng)).toBeString()
	}
})
