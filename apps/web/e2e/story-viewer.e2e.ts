import { expect, test } from "@playwright/test"

test.describe("Story Viewer", () => {
	test("story navigation between variants", async ({ page }) => {
		// Navigate to controlled story - should have controls
		await page.goto("/ui/button/controlled")
		await page.waitForSelector("h1")
		const controlsPanel = page.locator("text=Controls")
		await expect(controlsPanel).toBeVisible()

		// Navigate to matrix story - should have multiple cells
		await page.goto("/ui/button/matrix")
		await page.waitForSelector("h1")
		const cells = page.locator('main [role="button"]')
		const count = await cells.count()
		expect(count).toBeGreaterThan(5)
	})

	test("visual snapshot", async ({ page }) => {
		await page.goto("/ui/button/default")
		await page.waitForSelector("h1")
		await page.waitForTimeout(500)

		await expect(page.locator("main")).toHaveScreenshot("button-story-viewer.png", {
			maxDiffPixels: 200,
		})
	})
})
