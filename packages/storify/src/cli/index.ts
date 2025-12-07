#!/usr/bin/env node
import { init } from "./init"

const args = process.argv.slice(2)

// Parse flags
const workspace = args.includes("--workspace") || args.includes("-w")
const force = args.includes("--force") || args.includes("-f")
const help = args.includes("--help") || args.includes("-h")

if (help) {
	console.log(`
storify v1.0.0
Zero-config component stories for React frameworks

Usage:
  npx @ftzi/storify [options]

Options:
  -w, --workspace  Use @workspace/storify imports (monorepo setup)
  -f, --force      Overwrite existing files
  -h, --help       Show this help message
`)
	process.exit(0)
}

console.log("Initializing Storify...")

const result = init({
	workspace,
	skipExisting: !force,
})

if (result.created.length > 0) {
	console.log("\nCreated files:")
	for (const file of result.created) {
		console.log(`  + ${file}`)
	}
}

if (result.skipped.length > 0) {
	console.log("\nSkipped (already exist):")
	for (const file of result.skipped) {
		console.log(`  - ${file}`)
	}
}

if (result.errors.length > 0) {
	console.error("\nErrors:")
	for (const error of result.errors) {
		console.error(`  ! ${error}`)
	}
	process.exit(1)
}

if (result.success) {
	console.log("\nStorify initialized successfully!")
	console.log("\nNext steps:")
	console.log("  1. Start your dev server: npm run dev")
	console.log("  2. Visit http://localhost:3000/ui")
	console.log("  3. Add more stories in app/ui/stories/")
}
