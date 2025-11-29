import { story } from "nextbook"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const Default = story({
	render: () => <Input type="text" placeholder="Enter text..." />,
})

export const WithLabel = story({
	render: () => (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="email">Email</Label>
			<Input type="email" id="email" placeholder="Email" />
		</div>
	),
})

export const Disabled = story({
	render: () => <Input disabled type="text" placeholder="Disabled" />,
})

export const WithFile = story({
	render: () => (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="picture">Picture</Label>
			<Input id="picture" type="file" />
		</div>
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
