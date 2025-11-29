import { ArrowRight, Loader2, Mail } from "lucide-react"
import { story, storyMatrix } from "nextbook"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const Default = story({
	render: () => <Button>Button</Button>,
})

export const Secondary = story({
	render: () => <Button variant="secondary">Secondary</Button>,
})

export const Destructive = story({
	render: () => <Button variant="destructive">Destructive</Button>,
})

export const Outline = story({
	render: () => <Button variant="outline">Outline</Button>,
})

export const Ghost = story({
	render: () => <Button variant="ghost">Ghost</Button>,
})

export const Link = story({
	render: () => <Button variant="link">Link</Button>,
})

export const WithIcon = story({
	render: () => (
		<Button>
			<Mail />
			Login with Email
		</Button>
	),
})

export const IconRight = story({
	render: () => (
		<Button>
			Continue
			<ArrowRight />
		</Button>
	),
})

export const Loading = story({
	render: () => (
		<Button disabled>
			<Loader2 className="animate-spin" />
			Please wait
		</Button>
	),
})

export const Controlled = story({
	schema: z.object({
		label: z.string().default("Click me").describe("Button text"),
		variant: z
			.enum(["default", "secondary", "destructive", "outline", "ghost", "link"])
			.default("default")
			.describe("Button variant"),
		size: z.enum(["default", "sm", "lg", "icon"]).default("default").describe("Button size"),
		disabled: z.boolean().default(false).describe("Disabled state"),
	}),
	render: ({ label, variant, size, disabled }) => (
		<Button variant={variant} size={size} disabled={disabled}>
			{label}
		</Button>
	),
})

export const Matrix = storyMatrix({
	schema: z.object({
		variant: z.enum(["default", "secondary", "destructive", "outline", "ghost", "link"]),
		size: z.enum(["sm", "default", "lg"]),
	}),
	render: ({ variant, size }) => (
		<Button variant={variant} size={size}>
			Button
		</Button>
	),
})
