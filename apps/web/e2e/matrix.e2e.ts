import { expect, test } from "@playwright/test"

test.describe("Matrix Stories", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to button matrix story
		await page.goto("/ui/button/matrix")
		// Wait for the page to load
		await page.waitForSelector("h1")
	})

	test("matrix view renders", async ({ page }) => {
		// There should be a title
		const title = page.locator("h1")
		await expect(title).toBeVisible()
	})

	test("matrix grid renders multiple cells", async ({ page }) => {
		// There should be multiple button elements rendered (one per combination)
		const buttons = page.locator("main button")
		const count = await buttons.count()
		// Matrix should have multiple combinations (6 variants x 3 sizes = 18)
		// Plus some control buttons, so at least > 10
		expect(count).toBeGreaterThan(10)
	})

	test("displays multiple combinations", async ({ page }) => {
		// There should be multiple "Button" text instances (one per cell)
		// Each cell renders a Button component with text "Button"
		const buttonTexts = page.locator("text=Button")
		const count = await buttonTexts.count()
		expect(count).toBeGreaterThan(5)
	})

	test("shows combination labels", async ({ page }) => {
		// Should have labels showing the prop values - look for variant names
		const defaultLabel = page.locator("text=default").first()
		await expect(defaultLabel).toBeVisible()
	})

	test("renders all variant types", async ({ page }) => {
		// Check for different button variants in the matrix
		const variants = ["default", "secondary", "destructive", "outline", "ghost", "link"]

		// Use Promise.all to check all variants in parallel
		await Promise.all(variants.map((variant) => expect(page.locator(`text=${variant}`).first()).toBeVisible()))
	})

	test("renders size variants", async ({ page }) => {
		// Check for size labels - they appear in the combination labels
		// The matrix shows sizes like "sm", "default", "lg"
		const smLabel = page.locator("text=sm").first()
		await expect(smLabel).toBeVisible()

		const lgLabel = page.locator("text=lg").first()
		await expect(lgLabel).toBeVisible()
	})

	test("clicking a cell shows expanded view", async ({ page }) => {
		// Find and click a cell button (these are clickable grid cells)
		// The cells have button tags that when clicked expand the view
		const cells = page.locator("main button").filter({ hasText: "Button" })
		await cells.first().click()

		// After clicking, should see "Back to matrix" button
		const backButton = page.locator("text=Back to matrix")
		await expect(backButton).toBeVisible()
	})

	test("back button returns to grid view", async ({ page }) => {
		// Click a cell to expand
		const cells = page.locator("main button").filter({ hasText: "Button" })
		await cells.first().click()

		// Click back button
		const backButton = page.locator("button").filter({ hasText: "Back to matrix" })
		await backButton.click()

		// Should see multiple cells again
		const cellsAgain = page.locator("main button").filter({ hasText: "Button" })
		const count = await cellsAgain.count()
		expect(count).toBeGreaterThan(5)
	})

	test("takes visual snapshot of matrix view", async ({ page }) => {
		// Wait for combinations to render
		await page.waitForTimeout(1000)

		// Take snapshot of the main area
		await expect(page.locator("main")).toHaveScreenshot("button-matrix.png", {
			maxDiffPixels: 300,
		})
	})
})
