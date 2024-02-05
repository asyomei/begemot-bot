import { args, build, cmd, desc, msg } from "#/utils/help-text"

export const helpText = build`
  ${msg("help.header")}

  ${cmd("bonus")} - ${desc("bonus")}
  ${cmd("balance")} - ${desc("balance")}

  ${cmd("transfer")} ${args("transfer")} - ${desc("transfer")}

  ${cmd("profile")} - ${desc("profile")}

  ${cmd("top")} - ${desc("top")}

  ${cmd("language")} - ${desc("language")}
`

export const adminHelpText = build`
  ${cmd("admin.stats")} - ${desc("admin.stats")}

  ${cmd("admin.memory")} - ${desc("admin.memory")}
`
