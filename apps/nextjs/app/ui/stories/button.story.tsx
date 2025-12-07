import { story, storyMatrix } from "@ftzi/storify"
import { ArrowRight, Loader2, Mail } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const Matrix = storyMatrix({
	schema: z.object({
		variant: z.enum(["default", "secondary", "destructive", "outline", "ghost", "link"]),
		size: z.enum(["sm", "default", "lg"]),
		state: z.enum(["default", "withIcon", "iconRight", "loading"]),
	}),
	render: ({ variant, size, state }) => {
		if (state === "loading") {
			return (
				<Button variant={variant} size={size} disabled>
					<Loader2 className="animate-spin" />
					Please wait
				</Button>
			)
		}
		if (state === "withIcon") {
			return (
				<Button variant={variant} size={size}>
					<Mail />
					Login with Email
				</Button>
			)
		}
		if (state === "iconRight") {
			return (
				<Button variant={variant} size={size}>
					Continue
					<ArrowRight />
				</Button>
			)
		}
		return (
			<Button variant={variant} size={size}>
				Button
			</Button>
		)
	},
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
