"use client"

import { story } from "nextbook"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const Default = story({
	render: () => (
		<div className="flex items-center space-x-2">
			<Switch id="airplane-mode" />
			<Label htmlFor="airplane-mode">Airplane Mode</Label>
		</div>
	),
})

export const Disabled = story({
	render: () => (
		<div className="flex items-center space-x-2">
			<Switch id="disabled" disabled />
			<Label htmlFor="disabled">Disabled</Label>
		</div>
	),
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
