import { sequentialize } from "@grammyjs/runner"
import { Context } from "grammy"

export default sequentialize<Context>((ctx) =>
  [ctx.chat?.id, ctx.from?.id].filter(Boolean).map(String),
)
