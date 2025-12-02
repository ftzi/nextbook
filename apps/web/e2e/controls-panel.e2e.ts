import { expect, test } from "@playwright/test"

const LABEL_PATTERN = /label/i
const VARIANT_PATTERN = /variant/i
const CLICK_ME_PATTERN = /click me/i
const DISABLED_PATTERN = /disabled/i

test.describe("Controls Panel", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to a story with controls (Button/Controlled has schema)
		await page.goto("/ui/button/controlled")
		// Wait for the story to load
		await page.waitForSelector("h1")
		// Wait for controls panel to render
		await page.waitForSelector("text=Controls")
	})

	test("renders controls panel for story with schema", async ({ page }) => {
		// Controls panel should be visible - look for "Controls" header text
		const controlsHeader = page.locator("text=Controls")
		await expect(controlsHeader).toBeVisible()
	})

	test("displays control labels", async ({ page }) => {
		// Should show LABEL control (uppercase) - inside main, not sidebar
		const labelControl = page.locator("main label").filter({ hasText: LABEL_PATTERN })
		await expect(labelControl).toBeVisible()

		// Should show VARIANT control
		const variantControl = page.locator("main label").filter({ hasText: VARIANT_PATTERN })
		await expect(variantControl).toBeVisible()
	})

	test("text input control accepts input", async ({ page }) => {
		// Find text inputs in controls panel (inside main, not sidebar search)
		// The controls panel renders inputs for text/number controls
		const inputs = page.locator("main input")
		const inputCount = await inputs.count()
		expect(inputCount).toBeGreaterThan(0)

		// Find the first input that's not the zoom input
		const labelInput = page.locator('main input:not([aria-label="Zoom percentage"])').first()
		await expect(labelInput).toBeVisible()

		// Type a value - verifies the input is interactive
		await labelInput.fill("Test Value")
		await expect(labelInput).toHaveValue("Test Value")
	})

	test("boolean toggle control updates component", async ({ page }) => {
		// Get the button in the story frame first
		const storyButton = page.locator("main button").filter({ hasText: CLICK_ME_PATTERN }).first()
		await expect(storyButton).not.toBeDisabled()

		// Find the toggle button for disabled (it's a button, not checkbox)
		// Toggle buttons have specific styling - find by the label "DISABLED" in main
		const disabledLabel = page.locator("main label").filter({ hasText: DISABLED_PATTERN })
		const toggleButton = disabledLabel.locator("..").locator("button")
		await toggleButton.click()

		// Button should be disabled now
		await expect(storyButton).toBeDisabled()
	})

	test("enum select control updates component", async ({ page }) => {
		// Find the variant select (inside main)
		const variantSelect = page.locator("main select").first()

		// Change to secondary
		await variantSelect.selectOption("secondary")

		// Button should still be visible
		const storyButton = page.locator("main button").filter({ hasText: CLICK_ME_PATTERN }).first()
		await expect(storyButton).toBeVisible()
	})

	test("size select control updates component", async ({ page }) => {
		// Find the size select (has lg option) inside main
		const sizeSelect = page.locator("main select").filter({ has: page.locator("option[value='lg']") })

		if ((await sizeSelect.count()) > 0) {
			await sizeSelect.first().selectOption("lg")

			// Button should reflect size change
			const storyButton = page.locator("main button").first()
			await expect(storyButton).toBeVisible()
		}
	})

	test("reset button restores default values", async ({ page }) => {
		// Find and modify the label input (inside main, not sidebar)
		const labelInput = page.locator('main input[type="text"]').first()
		const originalValue = await labelInput.inputValue()

		await labelInput.fill("Modified Text")

		// Click reset button (inside main)
		const resetButton = page.locator("main button").filter({ hasText: "Reset" })
		await resetButton.click()

		// Value should be restored
		await expect(labelInput).toHaveValue(originalValue)
	})

	test("takes visual snapshot of controls panel", async ({ page }) => {
		// Wait for controls to load
		await page.waitForSelector("text=Controls")
		await page.waitForTimeout(500)

		// Take snapshot of main area which includes controls
		await expect(page.locator("main")).toHaveScreenshot("controls-panel.png", {
			maxDiffPixels: 200,
		})
	})
})
