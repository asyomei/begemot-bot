import { autoRetry } from "@grammyjs/auto-retry"
import { fromTransformer } from "./_utils"

export default fromTransformer(autoRetry())
