"use client"

import { story } from "nextbook"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export const Default = story({
	render: () => (
		<div className="flex items-center space-x-2">
			<Checkbox id="terms" />
			<Label htmlFor="terms">Accept terms and conditions</Label>
		</div>
	),
})

export const WithText = story({
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

export const Disabled = story({
	render: () => (
		<div className="flex items-center space-x-2">
			<Checkbox id="terms2" disabled />
			<Label htmlFor="terms2">Accept terms and conditions</Label>
		</div>
	),
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
