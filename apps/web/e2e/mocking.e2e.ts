import { expect, test } from "@playwright/test"

const MOCKS_INDICATOR_PATTERN = /^Mocks$/

test.describe("MSW Mocking", () => {
	test("mocks indicator appears for story with mocks", async ({ page }) => {
		// Navigate to the user-card story which has mocks
		await page.goto("/ui/data-fetching/user-card/default")

		// Wait for MSW to initialize and story to load
		await page.waitForSelector("h1")
		await page.waitForTimeout(2000)

		// Mocks indicator should be visible - it's a div containing exactly "Mocks" (not DynamicMocks)
		const mocksIndicator = page.locator("div").filter({ hasText: MOCKS_INDICATOR_PATTERN })
		await expect(mocksIndicator).toBeVisible({ timeout: 10000 })
	})

	test("mocks indicator is hidden for story without mocks", async ({ page }) => {
		// Navigate to a story without mocks
		await page.goto("/ui/button/default")

		// Wait for story to load
		await page.waitForSelector("h1")
		await page.waitForTimeout(1000)

		// Mocks indicator should not be visible - look for the exact "Mocks" text
		const mocksIndicator = page.locator("div").filter({ hasText: MOCKS_INDICATOR_PATTERN })
		await expect(mocksIndicator).not.toBeVisible()
	})

	// Note: The following tests verify that routes with mocks load correctly.
	// The h1 displays the story variant name.

	test("user-card default story loads", async ({ page }) => {
		await page.goto("/ui/data-fetching/user-card/default")
		await page.waitForSelector("h1")
		// Verify the page loads - h1 shows the story name
		const title = page.locator("h1")
		await expect(title).toBeVisible()
	})

	test("user-card configurable story loads", async ({ page }) => {
		await page.goto("/ui/data-fetching/user-card/configurable")
		await page.waitForSelector("h1")
		const title = page.locator("h1")
		await expect(title).toBeVisible()
	})

	test("user-card server-error story loads", async ({ page }) => {
		await page.goto("/ui/data-fetching/user-card/server-error")
		await page.waitForSelector("h1")
		const title = page.locator("h1")
		await expect(title).toBeVisible()
	})

	test("user-card not-found story loads", async ({ page }) => {
		await page.goto("/ui/data-fetching/user-card/not-found")
		await page.waitForSelector("h1")
		const title = page.locator("h1")
		await expect(title).toBeVisible()
	})

	test("user-card loading story loads", async ({ page }) => {
		await page.goto("/ui/data-fetching/user-card/loading")
		await page.waitForSelector("h1")
		const title = page.locator("h1")
		await expect(title).toBeVisible()
	})

	test("user-card dynamic-mocks story has controls", async ({ page }) => {
		await page.goto("/ui/data-fetching/user-card/dynamic-mocks")
		await page.waitForSelector("h1")
		const title = page.locator("h1")
		await expect(title).toBeVisible()

		// Should have controls panel since this story has schema
		const controlsPanel = page.locator("text=Controls")
		await expect(controlsPanel).toBeVisible()
	})

	test("takes visual snapshot of user-card story", async ({ page }) => {
		await page.goto("/ui/data-fetching/user-card/default")
		await page.waitForSelector("h1")
		await page.waitForTimeout(1000)

		// Take snapshot of main area (shows loading or data based on MSW timing)
		await expect(page.locator("main")).toHaveScreenshot("user-card-story.png", {
			maxDiffPixels: 300,
		})
	})
})
