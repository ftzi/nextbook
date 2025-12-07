/**
 * Converts a kebab-case or snake_case segment to PascalCase for display.
 * Examples:
 *   "user-card" → "UserCard"
 *   "dropdown-menu" → "DropdownMenu"
 *   "button" → "Button"
 *   "my_component" → "MyComponent"
 */

const SEPARATOR_REGEX = /[-_]/

export function formatSegmentName(segment: string): string {
	return segment
		.split(SEPARATOR_REGEX)
		.map((part) => (part.length > 0 ? part.charAt(0).toUpperCase() + part.slice(1) : ""))
		.join("")
}
