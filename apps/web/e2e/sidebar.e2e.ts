import { expect, test } from "@playwright/test"

const BADGE_URL_PATTERN = /\/ui\/badge/i
const ACTIVE_CLASS_PATTERN = /active/i

test.describe("Sidebar Navigation", () => {
	test("search filters stories and shows empty state", async ({ page }) => {
		await page.goto("/ui")

		const searchInput = page.locator('input[placeholder*="Search"]')

		// Search for existing story
		await searchInput.fill("button")
		const buttonStory = page.locator("aside").locator("text=Button")
		await expect(buttonStory.first()).toBeVisible()

		// Search for non-existent story shows empty state
		await searchInput.fill("nonexistentstory12345")
		const emptyMessage = page.locator("text=No stories found")
		await expect(emptyMessage).toBeVisible()
	})

	test("folder expand/collapse and story navigation", async ({ page }) => {
		await page.goto("/ui")

		// Expand Forms folder
		const formsFolder = page.locator("aside button").filter({ hasText: "Forms" })
		await formsFolder.click()
		const inputStory = page.locator("aside a").filter({ hasText: "Input" })
		await expect(inputStory).toBeVisible()

		// Collapse Forms folder
		await formsFolder.click()
		await expect(inputStory).not.toBeVisible()

		// Navigate to Badge and verify active state
		const badgeStory = page.locator("aside a").filter({ hasText: "Badge" })
		await badgeStory.click()
		await expect(page).toHaveURL(BADGE_URL_PATTERN)

		// Button link should have active styling after navigation
		await page.goto("/ui/button")
		const buttonLink = page.locator("aside a").filter({ hasText: "Button" })
		const classes = await buttonLink.getAttribute("class")
		expect(classes).toMatch(ACTIVE_CLASS_PATTERN)
	})
})
