import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { writeWithMarkers } from "./marker-writer"

const TEST_DIR = join(import.meta.dir, "__test-marker-writer__")

describe("writeWithMarkers", () => {
	beforeEach(() => {
		if (!existsSync(TEST_DIR)) {
			mkdirSync(TEST_DIR, { recursive: true })
		}
	})

	afterEach(() => {
		if (existsSync(TEST_DIR)) {
			rmSync(TEST_DIR, { recursive: true })
		}
	})

	test("creates new file with markers", () => {
		const filePath = join(TEST_DIR, "new-file.md")
		const content = "# Test Content\n\nSome instructions here."

		const result = writeWithMarkers(filePath, content)

		expect(result).toEqual({ created: true, updated: false })
		expect(existsSync(filePath)).toBe(true)

		const written = readFileSync(filePath, "utf-8")
		expect(written).toContain("<!-- NEXTBOOK:START -->")
		expect(written).toContain("# Test Content")
		expect(written).toContain("<!-- NEXTBOOK:END -->")
		expect(written).toContain("<!-- Add your project-specific instructions below -->")
	})

	test("updates content between markers preserving user content", () => {
		const filePath = join(TEST_DIR, "existing-file.md")
		const initialContent = `User content at top

<!-- NEXTBOOK:START -->
# Old Content
This will be replaced.
<!-- NEXTBOOK:END -->

## My Custom Instructions

These should be preserved.
`
		writeFileSync(filePath, initialContent, "utf-8")

		const newContent = "# New Content\n\nUpdated instructions."
		const result = writeWithMarkers(filePath, newContent)

		expect(result).toEqual({ created: false, updated: true })

		const written = readFileSync(filePath, "utf-8")
		expect(written).toContain("User content at top")
		expect(written).toContain("# New Content")
		expect(written).toContain("Updated instructions.")
		expect(written).toContain("## My Custom Instructions")
		expect(written).toContain("These should be preserved.")
		expect(written).not.toContain("Old Content")
		expect(written).not.toContain("This will be replaced.")
	})

	test("appends markers to file without markers", () => {
		const filePath = join(TEST_DIR, "no-markers.md")
		const initialContent = `# Existing Content

Some user documentation.
`
		writeFileSync(filePath, initialContent, "utf-8")

		const newContent = "# Nextbook Instructions"
		const result = writeWithMarkers(filePath, newContent)

		expect(result).toEqual({ created: false, updated: true })

		const written = readFileSync(filePath, "utf-8")
		expect(written).toContain("# Existing Content")
		expect(written).toContain("Some user documentation.")
		expect(written).toContain("<!-- NEXTBOOK:START -->")
		expect(written).toContain("# Nextbook Instructions")
		expect(written).toContain("<!-- NEXTBOOK:END -->")
	})

	test("handles markers at very start of file", () => {
		const filePath = join(TEST_DIR, "markers-at-start.md")
		const initialContent = `<!-- NEXTBOOK:START -->
# Original
<!-- NEXTBOOK:END -->
User content after`
		writeFileSync(filePath, initialContent, "utf-8")

		const result = writeWithMarkers(filePath, "# Replaced")

		expect(result).toEqual({ created: false, updated: true })

		const written = readFileSync(filePath, "utf-8")
		expect(written).toContain("# Replaced")
		expect(written).toContain("User content after")
		expect(written).not.toContain("Original")
	})

	test("handles markers at very end of file", () => {
		const filePath = join(TEST_DIR, "markers-at-end.md")
		const initialContent = `User content before
<!-- NEXTBOOK:START -->
# Original
<!-- NEXTBOOK:END -->`
		writeFileSync(filePath, initialContent, "utf-8")

		const result = writeWithMarkers(filePath, "# Replaced")

		expect(result).toEqual({ created: false, updated: true })

		const written = readFileSync(filePath, "utf-8")
		expect(written).toContain("User content before")
		expect(written).toContain("# Replaced")
		expect(written).not.toContain("Original")
	})
})
