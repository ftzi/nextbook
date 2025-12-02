"use client"

import { story, storyMatrix } from "nextbook"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export const Matrix = storyMatrix({
	schema: z.object({
		checked: z.enum(["false", "true"]),
		disabled: z.enum(["false", "true"]),
	}),
	render: ({ checked, disabled }) => <Checkbox defaultChecked={checked === "true"} disabled={disabled === "true"} />,
})

export const Controlled = story({
	schema: z.object({
		label: z.string().default("Accept terms and conditions").describe("Checkbox label"),
		disabled: z.boolean().default(false).describe("Disabled state"),
		defaultChecked: z.boolean().default(false).describe("Default checked"),
	}),
	render: ({ label, disabled, defaultChecked }) => (
		<div className="flex items-center space-x-2">
			<Checkbox id="controlled" disabled={disabled} defaultChecked={defaultChecked} />
			<Label htmlFor="controlled">{label}</Label>
		</div>
	),
})

export const WithDescription = story({
	render: () => (
		<div className="items-top flex space-x-2">
			<Checkbox id="terms1" />
			<div className="grid gap-1.5 leading-none">
				<Label htmlFor="terms1">Accept terms and conditions</Label>
				<p className="text-muted-foreground text-sm">You agree to our Terms of Service and Privacy Policy.</p>
			</div>
		</div>
	),
})
