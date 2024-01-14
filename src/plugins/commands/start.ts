import { Composer } from "grammy"
import { MyContext } from "../../types/context"

const comp = new Composer<MyContext>()
export default comp

comp.on("message:text").command("start", async (ctx) => {
  await ctx.reply(ctx.i18n.t("start.text"))
})
