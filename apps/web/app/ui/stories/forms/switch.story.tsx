"use client"

import { story, storyMatrix } from "nextbook"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const Matrix = storyMatrix({
	schema: z.object({
		checked: z.boolean(),
		disabled: z.boolean(),
	}),
	render: ({ checked, disabled }) => <Switch defaultChecked={checked} disabled={disabled} />,
})

export const Controlled = story({
	schema: z.object({
		label: z.string().default("Toggle feature").describe("Switch label"),
		disabled: z.boolean().default(false).describe("Disabled state"),
		defaultChecked: z.boolean().default(false).describe("Default checked"),
	}),
	render: ({ label, disabled, defaultChecked }) => (
		<div className="flex items-center space-x-2">
			<Switch id="controlled" disabled={disabled} defaultChecked={defaultChecked} />
			<Label htmlFor="controlled">{label}</Label>
		</div>
	),
})
