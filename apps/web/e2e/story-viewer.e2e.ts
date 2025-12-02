import { expect, test } from "@playwright/test"

test.describe("Story Viewer", () => {
	test("renders story component", async ({ page }) => {
		// Navigate to a specific story variant (not the matrix)
		await page.goto("/ui/button/default")

		// Should show story content - the button with text "Button"
		const storyButton = page.locator("main button").filter({ hasText: "Button" })
		await expect(storyButton.first()).toBeVisible()
	})

	test("displays story title in header", async ({ page }) => {
		await page.goto("/ui/button/default")
		await page.waitForSelector("h1")

		// The h1 shows the story variant name
		const title = page.locator("h1")
		await expect(title).toBeVisible()
		// The title text depends on the story - just verify it exists
		const titleText = await title.textContent()
		expect(titleText).toBeTruthy()
	})

	test("header controls exist", async ({ page }) => {
		await page.goto("/ui/button/default")
		await page.waitForSelector("h1")

		// There should be controls in the header area
		const header = page.locator("header")
		await expect(header).toBeVisible()
	})

	test("zoom input exists", async ({ page }) => {
		await page.goto("/ui/button/default")
		await page.waitForSelector("h1")

		// Find zoom input by aria-label
		const zoomInput = page.locator('input[aria-label="Zoom percentage"]')
		await expect(zoomInput).toBeVisible()
	})

	test("pan toggle button exists", async ({ page }) => {
		await page.goto("/ui/button/default")
		await page.waitForSelector("h1")

		// Find pan toggle button - it has aria-pressed attribute
		const panButton = page.locator("button[aria-pressed]")
		await expect(panButton).toBeVisible()
	})

	test("navigating to different story variants works", async ({ page }) => {
		// Navigate to button controlled story
		await page.goto("/ui/button/controlled")
		await page.waitForSelector("h1")

		// Verify content is different from default
		const controlsPanel = page.locator("text=Controls")
		await expect(controlsPanel).toBeVisible()

		// Navigate to button matrix story
		await page.goto("/ui/button/matrix")
		await page.waitForSelector("h1")

		// Matrix has many button combinations
		const buttons = page.locator("main button")
		const count = await buttons.count()
		expect(count).toBeGreaterThan(10)
	})

	test("takes visual snapshot of story viewer", async ({ page }) => {
		await page.goto("/ui/button/default")

		// Wait for content to load
		await page.waitForSelector("h1")
		await page.waitForTimeout(500) // Let animations settle

		// Take snapshot of the main content area
		await expect(page.locator("main")).toHaveScreenshot("button-story-viewer.png", {
			maxDiffPixels: 200,
		})
	})
})
