import { fromComposer } from "../_utils"
import { StartComposer } from "./composer"
import { StartController } from "./controller"

export default fromComposer(() => new StartComposer(new StartController()))
