import type { Stories, StoryLoader, StoryLoaders, StoryTreeNode } from "./types"

/** Nested input structure for createStories */
type NestedLoaders = {
	[key: string]: StoryLoader | NestedLoaders
}

/**
 * Flatten nested loaders into a flat map with path keys.
 * { forms: { input: loader } } → { "forms/input": loader }
 */
function flattenLoaders(nested: NestedLoaders, prefix = ""): StoryLoaders {
	const flat: StoryLoaders = {}

	for (const [key, value] of Object.entries(nested)) {
		const path = prefix ? `${prefix}/${key}` : key

		if (typeof value === "function") {
			// It's a loader function
			flat[path] = value as StoryLoader
		} else {
			// It's a nested object - recurse
			Object.assign(flat, flattenLoaders(value as NestedLoaders, path))
		}
	}

	return flat
}

/**
 * Create stories from lazy loaders.
 *
 * This function is server-safe - it only builds the tree structure from keys.
 * Actual module loading happens on-demand when viewing a story.
 *
 * @example
 * export const stories = createStories({
 *   button: () => import("./button.story"),
 *   forms: {
 *     input: () => import("./forms/input.story"),
 *     select: () => import("./forms/select.story"),
 *   },
 * })
 */
export function createStories(nestedLoaders: NestedLoaders): Stories {
	// Flatten nested structure to path-based keys
	const loaders = flattenLoaders(nestedLoaders)

	// Build tree from paths - NO module loading here!
	const tree: StoryTreeNode[] = []

	for (const [filePath] of Object.entries(loaders)) {
		const segments = filePath.split("/")

		// Navigate/create tree structure
		let currentLevel = tree
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i] as string
			const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1)

			let node = currentLevel.find((n) => n.segment.toLowerCase() === segment.toLowerCase())

			if (!node) {
				node = {
					name: capitalizedSegment,
					segment: capitalizedSegment,
					children: [],
					// Store filePath on leaf nodes for loading
					...(i === segments.length - 1 && { filePath }),
				}
				currentLevel.push(node)
			}

			// Move to children for next iteration
			if (node.children) {
				currentLevel = node.children
			}
		}
	}

	return { tree, loaders }
}
