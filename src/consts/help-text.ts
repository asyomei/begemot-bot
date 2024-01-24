import { build, cmd, desc, msg } from "#/utils/help-text"

export const helpText = build`
  ${msg("help.header")}

  ${cmd("bonus")} - ${desc("bonus")}
  ${cmd("balance")} - ${desc("balance")}

  ${cmd("language")} - ${desc("language")}
`
