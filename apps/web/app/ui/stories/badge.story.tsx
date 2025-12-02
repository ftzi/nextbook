import { story, storyMatrix } from "nextbook"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"

export const Matrix = storyMatrix({
	schema: z.object({
		variant: z.enum(["default", "secondary", "destructive", "outline"]),
	}),
	render: ({ variant }) => <Badge variant={variant}>Badge</Badge>,
})

export const Controlled = story({
	schema: z.object({
		label: z.string().default("Badge").describe("Badge text"),
		variant: z.enum(["default", "secondary", "destructive", "outline"]).default("default").describe("Badge variant"),
	}),
	render: ({ label, variant }) => <Badge variant={variant}>{label}</Badge>,
})
