import { Composer } from "grammy"
import { isSuperadmin } from "#/filters/is-superadmin"
import { MyContext } from "#/types/context"
import { useFilter } from "#/utils/use-filter"

export abstract class Controller {
	protected composer = new Composer<MyContext>()
	readonly middleware = () => this.composer.middleware()
}

export abstract class AdminController extends Controller {
	constructor() {
		super()

		this.composer.use(useFilter(isSuperadmin))
	}
}
