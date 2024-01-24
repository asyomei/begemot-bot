export function fullName(
	first: string,
	last: string | null | undefined,
): string {
	return last ? `${first} ${last}` : first
}
