import { spawn, spawnSync } from "node:child_process"
import { readdirSync, readFileSync, watch, writeFileSync } from "node:fs"
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

// Regex patterns for SVG post-processing
const IMPORT_PATTERN = /import type \{ SVGProps \} from "react";/
const COMPONENT_PATTERN = /const (Svg\w+) = \(props: SVGProps<SVGSVGElement>\) => \(/
const EXPORT_PATTERN = /\);\nexport default (Svg\w+);/
const ID_ATTR_PATTERN = /id="([^"]+)"/g
const TEMPLATE_LITERAL_PATTERN = /="([^"]*\$\{[^}]+\}[^"]*)"/g

async function copyCSS() {
	await mkdir(distComponents, { recursive: true })
	await mkdir(distStyles, { recursive: true })

	// Copy component CSS files
	const cssFiles = readdirSync(srcComponents).filter((f) => f.endsWith(".css"))
	await Promise.all(cssFiles.map((file) => copyFile(join(srcComponents, file), join(distComponents, file))))

	// Copy styles directory
	await cp(srcStyles, distStyles, { recursive: true })
}

/**
 * Post-process SVG components that have ID references (gradients, filters, etc.)
 * to use React's useId() for unique IDs across multiple instances.
 */
function addUniqueIds(filePath: string) {
	const content = readFileSync(filePath, "utf-8")

	// Skip if already transformed (has useId import)
	if (content.includes("useId")) return

	// Check if file has url(#...) references - these need unique IDs
	if (!content.includes("url(#")) return

	// Extract all unique IDs used in the file (pattern: id="xxx" or url(#xxx))
	const ids = new Set<string>()
	for (const match of content.matchAll(ID_ATTR_PATTERN)) {
		ids.add(match[1] as string)
	}

	if (ids.size === 0) return

	// Generate variable declarations for each ID
	const idVars = Array.from(ids).map((id, i) => {
		const varName = `id${i}`
		return { original: id, varName }
	})

	// Build the new content
	let newContent = content

	// Replace import statement to add useId
	newContent = newContent.replace(IMPORT_PATTERN, '"use client"\n\nimport { useId, type SVGProps } from "react";')

	// Replace the arrow function to add useId call and ID variables
	const idDeclarations = idVars.map((v) => `\tconst ${v.varName} = \`\${id}-${v.original}\`;`).join("\n")

	newContent = newContent.replace(
		COMPONENT_PATTERN,
		`const $1 = (props: SVGProps<SVGSVGElement>) => {\n\tconst id = useId();\n${idDeclarations}\n\n\treturn (`,
	)

	// Replace closing - need to add return statement closing brace
	newContent = newContent.replace(EXPORT_PATTERN, ");\n};\nexport default $1;")

	// Replace all id="xxx" with id={varName}
	for (const v of idVars) {
		newContent = newContent.replace(new RegExp(`id="${v.original}"`, "g"), `id={${v.varName}}`)
	}

	// Replace all url(#xxx) with url(#${varName})
	for (const v of idVars) {
		newContent = newContent.replace(new RegExp(`url\\(#${v.original}\\)`, "g"), `url(#\${${v.varName}})`)
	}

	// Convert string attributes with template literals to JSX expressions
	// e.g., stroke="url(#${id0})" -> stroke={`url(#${id0})`}
	newContent = newContent.replace(TEMPLATE_LITERAL_PATTERN, "={`$1`}")

	writeFileSync(filePath, newContent)
}

function generateSVG() {
	// Run SVGR on assets directory
	const svgr = spawnSync("svgr", ["--out-dir", srcIcons, "--config-file", "svgr.config.js", assetsDir], {
		cwd: root,
		stdio: "inherit",
	})

	if (svgr.status !== 0) process.exit(1)

	// Post-process generated files to add useId() for unique IDs
	const generatedFiles = readdirSync(srcIcons).filter((f) => f.endsWith(".tsx"))
	for (const file of generatedFiles) {
		addUniqueIds(join(srcIcons, file))
	}
}

async function build() {
	// Generate SVG icons
	generateSVG()

	// Clean dist
	await rm(distDir, { recursive: true, force: true })

	// Run tsc
	const tsc = spawnSync("tsc", ["-p", "tsconfig.build.json"], {
		cwd: root,
		stdio: "inherit",
	})
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

	// Debounce SVG generation to avoid multiple rapid calls
	let svgTimeout: ReturnType<typeof setTimeout> | null = null
	watch(assetsDir, (_event, filename) => {
		if (filename?.endsWith(".svg")) {
			if (svgTimeout) clearTimeout(svgTimeout)
			svgTimeout = setTimeout(() => {
				generateSVG()
				svgTimeout = null
			}, 100)
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
