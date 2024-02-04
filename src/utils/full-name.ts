export function fullName(
	first: string,
	last: string | null | undefined,
): string {
	return last ? `${first} ${last}` : first
}

export function fullNameBy(user: {
	first_name: string
	last_name?: string | null
}): string
export function fullNameBy(user: {
	firstName: string
	lastName?: string | null
}): string
export function fullNameBy(user: any) {
	if (user.firstName) return fullName(user.firstName, user.lastName)
	if (user.first_name) return fullName(user.first_name, user.last_name)
	return ""
}
