import { expect, test } from "@playwright/test"

const MOCKS_INDICATOR_PATTERN = /^Mocks$/

test.describe("MSW Mocking", () => {
	test("mocks indicator visibility based on story mocks", async ({ page }) => {
		// Story with mocks should show indicator
		await page.goto("/ui/data-fetching/user-card/default")
		await page.waitForSelector("h1")
		await page.waitForTimeout(2000) // Wait for MSW to initialize

		const mocksIndicator = page.locator("div").filter({ hasText: MOCKS_INDICATOR_PATTERN })
		await expect(mocksIndicator).toBeVisible({ timeout: 10000 })

		// Story without mocks should not show indicator
		await page.goto("/ui/button/default")
		await page.waitForSelector("h1")
		await page.waitForTimeout(1000)

		await expect(mocksIndicator).not.toBeVisible()
	})

	test("visual snapshot", async ({ page }) => {
		await page.goto("/ui/data-fetching/user-card/default")
		await page.waitForSelector("h1")
		await page.waitForTimeout(1000)

		await expect(page.locator("main")).toHaveScreenshot("user-card-story.png", {
			maxDiffPixels: 300,
		})
	})
})
