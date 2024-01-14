import { apiThrottler } from "@grammyjs/transformer-throttler"
import { fromTransformer } from "./_utils"

export default fromTransformer(apiThrottler())
