import { describe, expect, test } from "bun:test"
import { formatSegmentName } from "./format-name"

describe("formatSegmentName", () => {
	test("converts kebab-case to PascalCase", () => {
		expect(formatSegmentName("user-card")).toBe("UserCard")
		expect(formatSegmentName("dropdown-menu")).toBe("DropdownMenu")
		expect(formatSegmentName("data-fetching")).toBe("DataFetching")
	})

	test("converts snake_case to PascalCase", () => {
		expect(formatSegmentName("user_card")).toBe("UserCard")
		expect(formatSegmentName("my_component")).toBe("MyComponent")
	})

	test("handles single words", () => {
		expect(formatSegmentName("button")).toBe("Button")
		expect(formatSegmentName("card")).toBe("Card")
	})

	test("handles already capitalized input", () => {
		expect(formatSegmentName("Button")).toBe("Button")
		expect(formatSegmentName("User-Card")).toBe("UserCard")
	})

	test("handles multiple dashes", () => {
		expect(formatSegmentName("my-long-component-name")).toBe("MyLongComponentName")
	})

	test("handles empty string", () => {
		expect(formatSegmentName("")).toBe("")
	})

	test("handles leading/trailing dashes", () => {
		expect(formatSegmentName("-button")).toBe("Button")
		expect(formatSegmentName("button-")).toBe("Button")
	})
})
