import { spawn, spawnSync } from "node:child_process"
import { readdirSync, watch } from "node:fs"
import { copyFile, cp, mkdir, rm } from "node:fs/promises"
import { join } from "node:path"

const root = join(import.meta.dirname, "..")
const assetsDir = join(root, "..", "..", "assets")
const srcDir = join(root, "src")
const distDir = join(root, "dist")
const srcComponents = join(srcDir, "components")
const srcStyles = join(srcDir, "styles")
const srcIcons = join(srcComponents, "icons")
const distComponents = join(distDir, "components")
const distStyles = join(distDir, "styles")

const isWatch = process.argv.includes("--watch")

async function copyCSS() {
	await mkdir(distComponents, { recursive: true })
	await mkdir(distStyles, { recursive: true })

	// Copy component CSS files
	const cssFiles = readdirSync(srcComponents).filter((f) => f.endsWith(".css"))
	await Promise.all(cssFiles.map((file) => copyFile(join(srcComponents, file), join(distComponents, file))))

	// Copy styles directory
	await cp(srcStyles, distStyles, { recursive: true })
}

function generateSVG() {
	const svgr = spawnSync("svgr", ["--out-dir", srcIcons, "--config-file", "svgr.config.js", assetsDir], {
		cwd: root,
		stdio: "inherit",
	})
	if (svgr.status !== 0) process.exit(1)
}

async function build() {
	// Generate SVG icons
	generateSVG()

	// Clean dist
	await rm(distDir, { recursive: true, force: true })

	// Run tsc
	const tsc = spawnSync("tsc", ["-p", "tsconfig.build.json"], { cwd: root, stdio: "inherit" })
	if (tsc.status !== 0) process.exit(1)

	// Copy CSS
	await copyCSS()

	console.log("Build complete")
}

async function dev() {
	await build()

	// Start tsc watch
	const tsc = spawn("tsc", ["-p", "tsconfig.build.json", "--watch", "--preserveWatchOutput"], {
		cwd: root,
		stdio: "inherit",
	})

	// Watch CSS and SVG
	console.log("[watch] Watching CSS and SVG...")

	watch(srcComponents, async (_event, filename) => {
		if (filename?.endsWith(".css")) {
			await copyFile(join(srcComponents, filename), join(distComponents, filename))
			console.log(`[css] ${filename}`)
		}
	})

	watch(srcStyles, async (_event, filename) => {
		if (filename?.endsWith(".css")) {
			await copyFile(join(srcStyles, filename), join(distStyles, filename))
			console.log(`[css] styles/${filename}`)
		}
	})

	watch(assetsDir, (_event, filename) => {
		if (filename?.endsWith(".svg")) {
			console.log(`[svg] ${filename}`)
			generateSVG()
		}
	})

	process.on("SIGINT", () => {
		tsc.kill()
		process.exit(0)
	})
}

if (isWatch) {
	void dev()
} else {
	void build()
}
