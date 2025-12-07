import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { init } from "./init"

const TEST_DIR = join(import.meta.dir, ".test-tmp")

describe("nextbook init", () => {
	beforeEach(() => {
		// Clean up and create fresh test directory
		if (existsSync(TEST_DIR)) {
			rmSync(TEST_DIR, { recursive: true })
		}
		mkdirSync(TEST_DIR, { recursive: true })
	})

	afterEach(() => {
		// Clean up after tests
		if (existsSync(TEST_DIR)) {
			rmSync(TEST_DIR, { recursive: true })
		}
	})

	test("fails if app directory does not exist", () => {
		const result = init({ cwd: TEST_DIR })

		expect(result.success).toBe(false)
		expect(result.errors).toContain(`App directory not found: ${join(TEST_DIR, "app")}`)
	})

	test("creates all required files", () => {
		// Create app directory
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		const result = init({ cwd: TEST_DIR })

		expect(result.success).toBe(true)
		expect(result.errors).toHaveLength(0)
		expect(result.created).toHaveLength(6) // CLAUDE.md, AGENTS.md, layout, page, index, example

		// Verify files exist
		expect(existsSync(join(TEST_DIR, "app/ui/CLAUDE.md"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/AGENTS.md"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/layout.tsx"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/[[...path]]/page.tsx"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/stories/index.ts"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/stories/example.story.tsx"))).toBe(true)
	})

	test("uses npm imports by default", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const layout = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(layout).toContain('from "nextbook"')
		expect(layout).not.toContain("@workspace/nextbook")
	})

	test("uses workspace imports when --workspace flag is set", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR, workspace: true })

		const layout = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(layout).toContain('from "@workspace/nextbook"')
	})

	test("skips existing files by default", () => {
		mkdirSync(join(TEST_DIR, "app/ui"), { recursive: true })

		// Create an existing file
		const existingContent = "// existing content"
		writeFileSync(join(TEST_DIR, "app/ui/layout.tsx"), existingContent)

		const result = init({ cwd: TEST_DIR })

		expect(result.success).toBe(true)
		expect(result.skipped).toContain(join(TEST_DIR, "app/ui/layout.tsx"))

		// Verify existing file was not overwritten
		const content = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(content).toBe(existingContent)
	})

	test("overwrites existing files when skipExisting is false", () => {
		mkdirSync(join(TEST_DIR, "app/ui"), { recursive: true })

		// Create an existing file
		writeFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "// existing content")

		const result = init({ cwd: TEST_DIR, skipExisting: false })

		expect(result.success).toBe(true)
		expect(result.created).toContain(join(TEST_DIR, "app/ui/layout.tsx"))

		// Verify file was overwritten
		const content = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(content).toContain("NextbookShell")
	})

	test("creates correct directory structure", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		expect(existsSync(join(TEST_DIR, "app/ui"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/stories"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/[[...path]]"))).toBe(true)
	})

	test("layout contains NextbookShell", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const layout = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(layout).toContain("NextbookShell")
		expect(layout).toContain("stories")
		expect(layout).toContain("export default function")
	})

	test("page contains StoryPage component", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const page = readFileSync(join(TEST_DIR, "app/ui/[[...path]]/page.tsx"), "utf-8")
		expect(page).toContain("StoryPage")
		expect(page).toContain("stories")
		expect(page).toContain("params")
		expect(page).toContain("path")
	})

	test("stories index uses createStories", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const index = readFileSync(join(TEST_DIR, "app/ui/stories/index.ts"), "utf-8")
		expect(index).toContain("createStories")
		expect(index).toContain("use client")
		expect(index).toContain("example.story")
	})

	test("example story uses story() function", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const story = readFileSync(join(TEST_DIR, "app/ui/stories/example.story.tsx"), "utf-8")
		expect(story).toContain("story({")
		expect(story).toContain("render:")
		expect(story).toContain("export const Default")
		expect(story).toContain("export const WithControls")
	})

	test("CLAUDE.md and AGENTS.md contain AI assistant instructions with markers", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const claude = readFileSync(join(TEST_DIR, "app/ui/CLAUDE.md"), "utf-8")
		const agents = readFileSync(join(TEST_DIR, "app/ui/AGENTS.md"), "utf-8")

		// Both files should have the same content
		for (const content of [claude, agents]) {
			expect(content).toContain("<!-- NEXTBOOK:START -->")
			expect(content).toContain("<!-- NEXTBOOK:END -->")
			expect(content).toContain("Nextbook")
			expect(content).toContain("story(")
			expect(content).toContain("storyMatrix")
			expect(content).toContain("createStories")
			expect(content).toContain("use client")
		}
	})

	test("AI instruction files are upgradable via markers", () => {
		mkdirSync(join(TEST_DIR, "app/ui"), { recursive: true })

		// Pre-existing CLAUDE.md with user content
		const existingContent = `# My Project

Custom instructions here.

<!-- NEXTBOOK:START -->
# Old Nextbook Content
This will be replaced.
<!-- NEXTBOOK:END -->

## My Custom Section

More user content.
`
		writeFileSync(join(TEST_DIR, "app/ui/CLAUDE.md"), existingContent)

		init({ cwd: TEST_DIR })

		const claude = readFileSync(join(TEST_DIR, "app/ui/CLAUDE.md"), "utf-8")

		// User content should be preserved
		expect(claude).toContain("# My Project")
		expect(claude).toContain("Custom instructions here.")
		expect(claude).toContain("## My Custom Section")
		expect(claude).toContain("More user content.")

		// Old nextbook content should be replaced
		expect(claude).not.toContain("Old Nextbook Content")
		expect(claude).not.toContain("This will be replaced.")

		// New nextbook content should be present
		expect(claude).toContain("storyMatrix")
	})

	test("supports custom app directory", () => {
		mkdirSync(join(TEST_DIR, "src/app"), { recursive: true })

		const result = init({ cwd: TEST_DIR, appDir: "src/app" })

		expect(result.success).toBe(true)
		expect(existsSync(join(TEST_DIR, "src/app/ui/layout.tsx"))).toBe(true)
	})

	test("supports custom ui path", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		const result = init({ cwd: TEST_DIR, uiPath: "storybook" })

		expect(result.success).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/storybook/layout.tsx"))).toBe(true)
	})

	test("full installation flow: fresh install, upgrade, and customization preserved", () => {
		// Step 1: Fresh install
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		const firstResult = init({ cwd: TEST_DIR })

		expect(firstResult.success).toBe(true)
		expect(firstResult.created).toHaveLength(6)
		expect(firstResult.skipped).toHaveLength(0)

		// Verify all files created
		const expectedFiles = [
			"app/ui/CLAUDE.md",
			"app/ui/AGENTS.md",
			"app/ui/layout.tsx",
			"app/ui/[[...path]]/page.tsx",
			"app/ui/stories/index.ts",
			"app/ui/stories/example.story.tsx",
		]
		for (const file of expectedFiles) {
			expect(existsSync(join(TEST_DIR, file))).toBe(true)
		}

		// Read initial AI file content
		const initialClaude = readFileSync(join(TEST_DIR, "app/ui/CLAUDE.md"), "utf-8")
		expect(initialClaude).toContain("<!-- NEXTBOOK:START -->")
		expect(initialClaude).toContain("<!-- NEXTBOOK:END -->")
		expect(initialClaude).toContain("storyMatrix")

		// Step 2: User adds custom instructions to CLAUDE.md
		const customContent = `# My Project Instructions

These are my custom project-specific instructions.

${initialClaude}

## Additional Custom Section

More project-specific content that should survive upgrades.
`
		writeFileSync(join(TEST_DIR, "app/ui/CLAUDE.md"), customContent)

		// Step 3: Re-run init (simulating upgrade)
		const secondResult = init({ cwd: TEST_DIR })

		expect(secondResult.success).toBe(true)
		// AI files are always updated, regular files are skipped
		expect(secondResult.created).toContain(join(TEST_DIR, "app/ui/CLAUDE.md"))
		expect(secondResult.created).toContain(join(TEST_DIR, "app/ui/AGENTS.md"))
		expect(secondResult.skipped).toContain(join(TEST_DIR, "app/ui/layout.tsx"))

		// Step 4: Verify user customizations are preserved
		const upgradedClaude = readFileSync(join(TEST_DIR, "app/ui/CLAUDE.md"), "utf-8")

		// User content preserved
		expect(upgradedClaude).toContain("# My Project Instructions")
		expect(upgradedClaude).toContain("These are my custom project-specific instructions.")
		expect(upgradedClaude).toContain("## Additional Custom Section")
		expect(upgradedClaude).toContain("More project-specific content that should survive upgrades.")

		// Nextbook content still present
		expect(upgradedClaude).toContain("<!-- NEXTBOOK:START -->")
		expect(upgradedClaude).toContain("<!-- NEXTBOOK:END -->")
		expect(upgradedClaude).toContain("storyMatrix")

		// Step 5: Verify other files weren't overwritten
		const layout = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(layout).toContain("NextbookShell") // Original content intact
	})
})
