import { story, storyMatrix } from "nextbook"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const Matrix = storyMatrix({
	schema: z.object({
		type: z.enum(["text", "email", "password", "number"]),
		disabled: z.enum(["false", "true"]),
	}),
	render: ({ type, disabled }) => (
		<Input type={type} placeholder={`Enter ${type}...`} disabled={disabled === "true"} className="w-[200px]" />
	),
})

export const Controlled = story({
	schema: z.object({
		placeholder: z.string().default("Enter text...").describe("Placeholder text"),
		type: z.enum(["text", "email", "password", "number", "tel", "url"]).default("text").describe("Input type"),
		disabled: z.boolean().default(false).describe("Disabled state"),
	}),
	render: ({ placeholder, type, disabled }) => (
		<Input type={type} placeholder={placeholder} disabled={disabled} className="w-[300px]" />
	),
})

export const WithLabel = story({
	render: () => (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="email">Email</Label>
			<Input type="email" id="email" placeholder="Email" />
		</div>
	),
})

export const WithFile = story({
	render: () => (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="picture">Picture</Label>
			<Input id="picture" type="file" />
		</div>
	),
})
