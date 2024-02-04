export function fullName(firstName: string, lastName?: string | null): string
export function fullName(user: {
	firstName: string
	lastName?: string | null
}): string
export function fullName(user: {
	first_name: string
	last_name?: string | null
}): string
export function fullName(...args: any[]): string {
	if (args.length === 2) {
		const [first, last] = args
		return last ? `${first} ${last}` : first
	}

	const user = args[0]
	if ("firstName" in user) return fullName(user.firstName, user.lastName)
	if ("first_name" in user) return fullName(user.first_name, user.last_name)
	return ""
}
