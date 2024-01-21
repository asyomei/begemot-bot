test("botCommands", async () => {
	const { botCommands } = await import("#/consts/bot-commands")

	expect(botCommands).toBeInstanceOf(Array)
})
