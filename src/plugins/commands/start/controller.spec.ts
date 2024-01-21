import { StartController } from "./controller"

const con = new StartController()

test("start controller.start", () => {
	expect(con.start("ru")).toMatchInlineSnapshot(`"Пинг!"`)
	expect(con.start("en")).toMatchInlineSnapshot(`"Ping!"`)
})
