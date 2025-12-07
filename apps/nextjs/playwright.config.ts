import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
	testDir: "./e2e",
	testMatch: "**/*.e2e.ts",
	outputDir: "./e2e/.output/results",
	snapshotDir: "./e2e/.snapshots",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 0 : 0,
	workers: process.env.CI ? 1 : "100%",
	timeout: 10000,
	reporter: [["html", { outputFolder: "./e2e/.output/report" }]],
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "bun dev",
		url: "http://localhost:3000",
		reuseExistingServer: true,
		timeout: 120000,
	},
})
