import { build, cmd, desc, msg } from "#/utils/help-text"

export const helpText = build`
  ${msg("help.header")}

  ${cmd("bonus")} - ${desc("bonus")}
  ${cmd("balance")} - ${desc("balance")}

  ${cmd("profile")} - ${desc("profile")}

  ${cmd("language")} - ${desc("language")}
`

export const adminHelpText = build`
  ${cmd("admin.stats")} - ${desc("admin.stats")}

  ${cmd("admin.memory")} - ${desc("admin.memory")}
`
