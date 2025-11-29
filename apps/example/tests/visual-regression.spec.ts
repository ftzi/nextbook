import { expect, test } from "@playwright/test"

const WELCOME_HEADING_PATTERN = /welcome to nextbook/i
const BUTTON_PATTERN = /button/i

test.describe("Nextbook Visual Regression", () => {
	test("welcome page renders correctly", async ({ page }) => {
		await page.goto("/ui")
		await expect(page.getByRole("heading", { name: WELCOME_HEADING_PATTERN })).toBeVisible()
		await expect(page).toHaveScreenshot("welcome-page.png")
	})

	test("sidebar navigation works", async ({ page }) => {
		await page.goto("/ui")

		// Expand Button section
		await page.getByRole("button", { name: BUTTON_PATTERN }).click()
		await expect(page.getByRole("link", { name: "Default" })).toBeVisible()

		// Navigate to Button / Default
		await page.getByRole("link", { name: "Default" }).click()
		await expect(page.getByRole("heading", { name: "Button / Default" })).toBeVisible()
	})

	test.describe("Button Stories", () => {
		test("default button", async ({ page }) => {
			await page.goto("/ui/button/default")
			await expect(page.getByRole("heading", { name: "Button / Default" })).toBeVisible()
			await expect(page).toHaveScreenshot("button-default.png")
		})

		test("secondary button", async ({ page }) => {
			await page.goto("/ui/button/secondary")
			await expect(page.getByRole("heading", { name: "Button / Secondary" })).toBeVisible()
			await expect(page).toHaveScreenshot("button-secondary.png")
		})

		test("outline button", async ({ page }) => {
			await page.goto("/ui/button/outline")
			await expect(page.getByRole("heading", { name: "Button / Outline" })).toBeVisible()
			await expect(page).toHaveScreenshot("button-outline.png")
		})

		test("disabled button", async ({ page }) => {
			await page.goto("/ui/button/disabled")
			await expect(page.getByRole("heading", { name: "Button / Disabled" })).toBeVisible()
			await expect(page).toHaveScreenshot("button-disabled.png")
		})

		test("interactive button with controls", async ({ page }) => {
			await page.goto("/ui/button/interactive")
			await expect(page.getByRole("heading", { name: "Button / Interactive" })).toBeVisible()

			// Verify controls panel is visible
			await expect(page.getByText("Controls")).toBeVisible()
			await expect(page).toHaveScreenshot("button-interactive.png")
		})
	})

	test.describe("Card Stories", () => {
		test("default card", async ({ page }) => {
			await page.goto("/ui/card/default")
			await expect(page.getByRole("heading", { name: "Card / Default" })).toBeVisible()
			await expect(page).toHaveScreenshot("card-default.png")
		})

		test("card with image", async ({ page }) => {
			await page.goto("/ui/card/withimage")
			await expect(page.getByRole("heading", { name: "Card / WithImage" })).toBeVisible()
			await expect(page).toHaveScreenshot("card-withimage.png")
		})
	})

	test.describe("Form Stories", () => {
		test("input default", async ({ page }) => {
			await page.goto("/ui/forms/input/default")
			await expect(page.getByRole("heading", { name: "Forms / Input / Default" })).toBeVisible()
			await expect(page).toHaveScreenshot("forms-input-default.png")
		})

		test("checkbox default", async ({ page }) => {
			await page.goto("/ui/forms/checkbox/default")
			await expect(page.getByRole("heading", { name: "Forms / Checkbox / Default" })).toBeVisible()
			await expect(page).toHaveScreenshot("forms-checkbox-default.png")
		})
	})

	test.describe("Background Switcher", () => {
		test("can switch to striped background", async ({ page }) => {
			await page.goto("/ui/button/default")

			// Click striped background button
			await page.getByRole("button", { name: "Striped" }).click()
			await expect(page).toHaveScreenshot("background-striped.png")
		})

		test("can switch to magenta background", async ({ page }) => {
			await page.goto("/ui/button/default")

			// Click magenta background button
			await page.getByRole("button", { name: "Magenta" }).click()
			await expect(page).toHaveScreenshot("background-magenta.png")
		})
	})
})
