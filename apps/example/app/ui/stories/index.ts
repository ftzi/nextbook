"use client"

import { createStories } from "nextbook"

export const stories = createStories({
	button: () => import("./button.story"),
	card: () => import("./card.story"),
	forms: {
		input: () => import("./forms/input.story"),
		checkbox: () => import("./forms/checkbox.story"),
	},
})
