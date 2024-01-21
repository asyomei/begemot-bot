import { fromComposer } from "../_utils"
import { HelpComposer } from "./composer"
import { HelpController } from "./controller"

export default fromComposer(() => new HelpComposer(new HelpController()))
