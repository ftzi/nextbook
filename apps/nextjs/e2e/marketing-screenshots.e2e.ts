import { expect, test } from "@playwright/test"

test.describe("Marketing Screenshots", () => {
	test("hero screenshot", async ({ page }) => {
		await page.setViewportSize({ width: 1200, height: 800 })
		await page.goto("/ui/button/controlled")
		await page.waitForLoadState("networkidle")
		await page.locator("text=Controls").first().waitFor({ state: "visible" })
		await page.waitForTimeout(500)

		const screenshot = await page.screenshot({
			path: "public/images/hero-screenshot.png",
			type: "png",
		})

		expect(screenshot).toMatchSnapshot("hero-screenshot.png")
	})
})
