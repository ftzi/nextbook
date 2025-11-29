import { story } from "nextbook"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const Default = story({
	render: () => <Textarea placeholder="Type your message here." />,
})

export const WithLabel = story({
	render: () => (
		<div className="grid w-full gap-1.5">
			<Label htmlFor="message">Your message</Label>
			<Textarea placeholder="Type your message here." id="message" />
		</div>
	),
})

export const WithText = story({
	render: () => (
		<div className="grid w-full gap-1.5">
			<Label htmlFor="message-2">Your Message</Label>
			<Textarea placeholder="Type your message here." id="message-2" />
			<p className="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
		</div>
	),
})

export const Disabled = story({
	render: () => <Textarea placeholder="Disabled" disabled />,
})

export const Controlled = story({
	schema: z.object({
		placeholder: z.string().default("Type your message here.").describe("Placeholder text"),
		disabled: z.boolean().default(false).describe("Disabled state"),
		rows: z.number().min(2).max(20).default(4).describe("Number of rows"),
	}),
	render: ({ placeholder, disabled, rows }) => (
		<Textarea placeholder={placeholder} disabled={disabled} rows={rows} className="w-[300px]" />
	),
})
