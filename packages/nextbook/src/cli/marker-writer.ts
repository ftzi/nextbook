import { existsSync, readFileSync, writeFileSync } from "node:fs"

const START_MARKER = "<!-- NEXTBOOK:START -->"
const END_MARKER = "<!-- NEXTBOOK:END -->"

/**
 * Write content to a file using markers.
 * - If file doesn't exist: creates it with markers wrapping content
 * - If file exists with markers: replaces content between markers
 * - If file exists without markers: appends markers and content at the end
 *
 * This allows users to add custom instructions outside the markers
 * while the nextbook section can be upgraded by re-running the CLI.
 */
export function writeWithMarkers(filePath: string, content: string): { created: boolean; updated: boolean } {
	const markedContent = `${START_MARKER}\n${content}\n${END_MARKER}`

	if (!existsSync(filePath)) {
		// New file: write with markers + user section hint
		const fullContent = `${markedContent}\n\n<!-- Add your project-specific instructions below -->\n`
		writeFileSync(filePath, fullContent, "utf-8")
		return { created: true, updated: false }
	}

	// File exists: read and check for markers
	const existingContent = readFileSync(filePath, "utf-8")

	const startIndex = existingContent.indexOf(START_MARKER)
	const endIndex = existingContent.indexOf(END_MARKER)

	if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
		// Has markers: replace content between them
		const before = existingContent.slice(0, startIndex)
		const after = existingContent.slice(endIndex + END_MARKER.length)
		const newContent = `${before}${markedContent}${after}`
		writeFileSync(filePath, newContent, "utf-8")
		return { created: false, updated: true }
	}

	// No markers: append at the end
	const newContent = `${existingContent}\n\n${markedContent}\n\n<!-- Add your project-specific instructions below -->\n`
	writeFileSync(filePath, newContent, "utf-8")
	return { created: false, updated: true }
}
