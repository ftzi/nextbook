import { expect, test } from "@playwright/test"

test.describe("Matrix Stories", () => {
	test("cell click expands and back returns to grid", async ({ page }) => {
		await page.goto("/ui/button/matrix")
		await page.waitForSelector("h1")

		// Click a cell to expand
		const cells = page.locator('main [role="button"]')
		await cells.first().click()

		// Should see back button in expanded view
		const backButton = page.locator("button").filter({ hasText: "Back to matrix" })
		await expect(backButton).toBeVisible()

		// Click back and verify grid returns
		await backButton.click()

		// Wait for grid to re-render
		await page.waitForSelector('main [role="button"]')
		const cellsAgain = page.locator('main [role="button"]')
		const count = await cellsAgain.count()
		expect(count).toBeGreaterThan(5)
	})

	test("filter dropdown shows all variants", async ({ page }) => {
		await page.goto("/ui/button/matrix")
		await page.waitForSelector("h1")

		// Open variant filter
		const filterButton = page.locator("button").filter({ hasText: "variant" })
		await filterButton.click()

		// Verify all variants in dropdown
		const variants = ["default", "secondary", "destructive", "outline", "ghost", "link"]
		await Promise.all(
			variants.map((variant) => {
				const option = page.locator("label").filter({ hasText: variant })
				return expect(option.first()).toBeVisible()
			}),
		)
	})

	test("visual snapshot", async ({ page }) => {
		await page.goto("/ui/button/matrix")
		await page.waitForTimeout(1000)

		await expect(page.locator("main")).toHaveScreenshot("button-matrix.png", {
			maxDiffPixels: 300,
		})
	})
})
