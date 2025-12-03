import { expect, test } from "@playwright/test"

const CLICK_ME_PATTERN = /click me/i
const DISABLED_PATTERN = /disabled/i

test.describe("Controls Panel", () => {
	test("controls modify component and reset works", async ({ page }) => {
		await page.goto("/ui/button/controlled")
		await page.waitForSelector("text=Controls")

		// Get the button in the story frame
		const storyButton = page.locator("main button").filter({ hasText: CLICK_ME_PATTERN }).first()

		// Test text input
		const labelInput = page.locator('main input[type="text"]').first()
		const originalValue = await labelInput.inputValue()
		await labelInput.fill("Modified Text")
		await expect(labelInput).toHaveValue("Modified Text")

		// Test boolean toggle (disabled)
		await expect(storyButton).not.toBeDisabled()
		const disabledLabel = page.locator("main label").filter({ hasText: DISABLED_PATTERN })
		const toggleButton = disabledLabel.locator("..").locator("button")
		await toggleButton.click()
		await expect(storyButton).toBeDisabled()

		// Test enum select
		const variantSelect = page.locator("main select").first()
		await variantSelect.selectOption("secondary")

		// Test reset restores defaults
		const resetButton = page.locator("main button").filter({ hasText: "Reset" })
		await resetButton.click()
		await expect(labelInput).toHaveValue(originalValue)
		await expect(storyButton).not.toBeDisabled()
	})

	test("visual snapshot", async ({ page }) => {
		await page.goto("/ui/button/controlled")
		await page.waitForSelector("text=Controls")
		await page.waitForTimeout(500)

		await expect(page.locator("main")).toHaveScreenshot("controls-panel.png", {
			maxDiffPixels: 200,
		})
	})
})
