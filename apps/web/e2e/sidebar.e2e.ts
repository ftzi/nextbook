import { expect, test } from "@playwright/test"

const BADGE_URL_PATTERN = /\/ui\/badge/i
const ACTIVE_CLASS_PATTERN = /active/i

test.describe("Sidebar Navigation", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/ui")
	})

	test("renders sidebar with story categories", async ({ page }) => {
		const sidebar = page.locator("aside")
		await expect(sidebar).toBeVisible()
	})

	test("renders logo in sidebar header", async ({ page }) => {
		const logo = page.locator("aside a").first()
		await expect(logo).toBeVisible()
		await expect(logo).toHaveAttribute("href", "/ui")
	})

	test("has GitHub link", async ({ page }) => {
		const githubLink = page.locator('a[href*="github.com"]')
		await expect(githubLink).toBeVisible()
	})

	test("has search input", async ({ page }) => {
		const searchInput = page.locator('input[placeholder*="Search"]')
		await expect(searchInput).toBeVisible()
	})

	test("search filters stories", async ({ page }) => {
		const searchInput = page.locator('input[placeholder*="Search"]')
		await searchInput.fill("button")

		// Should show Button story
		const buttonStory = page.locator("aside").locator("text=Button")
		await expect(buttonStory.first()).toBeVisible()
	})

	test("search shows empty state when no results", async ({ page }) => {
		const searchInput = page.locator('input[placeholder*="Search"]')
		await searchInput.fill("nonexistentstory12345")

		const emptyMessage = page.locator("text=No stories found")
		await expect(emptyMessage).toBeVisible()
	})

	test("expands category on click", async ({ page }) => {
		// Find and click the Forms category
		const formsFolder = page.locator("aside button").filter({ hasText: "Forms" })
		await formsFolder.click()

		// Should show Input story inside
		const inputStory = page.locator("aside").locator("text=Input")
		await expect(inputStory).toBeVisible()
	})

	test("collapses category on second click", async ({ page }) => {
		// First expand Forms
		const formsFolder = page.locator("aside button").filter({ hasText: "Forms" })
		await formsFolder.click()

		// Verify Input is visible
		const inputStory = page.locator("aside a").filter({ hasText: "Input" })
		await expect(inputStory).toBeVisible()

		// Click again to collapse
		await formsFolder.click()

		// Input should be hidden
		await expect(inputStory).not.toBeVisible()
	})

	test("navigates to story on click", async ({ page }) => {
		// Click on Badge story
		const badgeStory = page.locator("aside a").filter({ hasText: "Badge" })
		await badgeStory.click()

		// URL should include badge
		await expect(page).toHaveURL(BADGE_URL_PATTERN)
	})

	test("highlights active story", async ({ page }) => {
		// Navigate to button story
		await page.goto("/ui/button")

		// Button link should have active styling
		const buttonLink = page.locator("aside a").filter({ hasText: "Button" })
		await expect(buttonLink).toBeVisible()

		// Check for active class (the actual class name has a hash)
		const classes = await buttonLink.getAttribute("class")
		expect(classes).toMatch(ACTIVE_CLASS_PATTERN)
	})
})
