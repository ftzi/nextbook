"use client"

import { createStories } from "nextbook"

export const stories = createStories({
	badge: () => import("./badge.story"),
	button: () => import("./button.story"),
	card: () => import("./card.story"),
	forms: {
		input: () => import("./forms/input.story"),
		textarea: () => import("./forms/textarea.story"),
		checkbox: () => import("./forms/checkbox.story"),
		switch: () => import("./forms/switch.story"),
		select: () => import("./forms/select.story"),
	},
	overlays: {
		dialog: () => import("./overlays/dialog.story"),
		popover: () => import("./overlays/popover.story"),
		tooltip: () => import("./overlays/tooltip.story"),
		"dropdown-menu": () => import("./overlays/dropdown-menu.story"),
	},
	navigation: {
		tabs: () => import("./navigation/tabs.story"),
	},
	avatar: () => import("./avatar.story"),
	progress: () => import("./progress.story"),
	"user-card": () => import("./user-card.story"),
})
