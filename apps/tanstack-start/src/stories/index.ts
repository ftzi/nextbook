"use client"

import { createStories } from "@ftzi/storify"

export const stories = createStories({
	button: () => import("./button.story"),
})
