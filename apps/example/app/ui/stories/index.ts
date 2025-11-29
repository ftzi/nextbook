"use client"

import { createStoryRegistry } from "nextbook"

export const { storyTree, loaders } = createStoryRegistry({
	button: () => import("./button.story"),
	card: () => import("./card.story"),
	forms: {
		input: () => import("./forms/input.story"),
		checkbox: () => import("./forms/checkbox.story"),
	},
})
