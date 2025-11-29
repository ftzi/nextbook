import { story, storyMatrix } from "nextbook"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"

export const Default = story({
	render: () => <Badge>Badge</Badge>,
})

export const Secondary = story({
	render: () => <Badge variant="secondary">Secondary</Badge>,
})

export const Destructive = story({
	render: () => <Badge variant="destructive">Destructive</Badge>,
})

export const Outline = story({
	render: () => <Badge variant="outline">Outline</Badge>,
})

export const Controlled = story({
	schema: z.object({
		label: z.string().default("Badge").describe("Badge text"),
		variant: z.enum(["default", "secondary", "destructive", "outline"]).default("default").describe("Badge variant"),
	}),
	render: ({ label, variant }) => <Badge variant={variant}>{label}</Badge>,
})

export const Matrix = storyMatrix({
	schema: z.object({
		variant: z.enum(["default", "secondary", "destructive", "outline"]),
	}),
	render: ({ variant }) => <Badge variant={variant}>Badge</Badge>,
})
