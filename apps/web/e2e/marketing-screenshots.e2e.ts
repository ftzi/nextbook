import { expect, test } from "@playwright/test"

/**
 * E2E tests for marketing screenshots used on the landing page.
 * These tests capture screenshots of the nextbook UI and save them to public/images.
 * If the screenshots change unexpectedly, these tests will fail.
 */
test.describe("Marketing Screenshots", () => {
	test("hero screenshot - nextbook UI with controls panel", async ({ page }) => {
		// Set viewport for consistent screenshot size (1200x800 as specified in placeholder)
		await page.setViewportSize({ width: 1200, height: 800 })

		// Navigate to the Controlled story which has a schema with controls
		await page.goto("/ui/button/controlled")

		// Wait for the page to fully load
		await page.waitForLoadState("networkidle")

		// Wait for the story to render
		await page.locator("main").waitFor({ state: "visible" })

		// Wait for controls panel to be visible (the "Controls" heading in the panel)
		await page.locator("text=Controls").first().waitFor({ state: "visible" })

		// Small delay to ensure all animations complete
		await page.waitForTimeout(500)

		// Take screenshot and save to public/images for use in hero
		const screenshot = await page.screenshot({
			path: "public/images/hero-screenshot.png",
			type: "png",
		})

		// Also compare against snapshot for regression testing
		expect(screenshot).toMatchSnapshot("hero-screenshot.png")
	})
})
