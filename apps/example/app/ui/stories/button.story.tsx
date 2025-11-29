import { story } from "nextbook"
import { z } from "zod"

export const Default = story({
	render: () => (
		<button type="button" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
			Click me
		</button>
	),
})

export const Secondary = story({
	render: () => (
		<button type="button" className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
			Secondary
		</button>
	),
})

export const Outline = story({
	render: () => (
		<button
			type="button"
			className="rounded-md border-2 border-blue-600 bg-transparent px-4 py-2 text-blue-600 hover:bg-blue-50"
		>
			Outline
		</button>
	),
})

export const Disabled = story({
	render: () => (
		<button
			type="button"
			disabled
			className="cursor-not-allowed rounded-md bg-gray-400 px-4 py-2 text-white opacity-50"
		>
			Disabled
		</button>
	),
})

export const Controlled = story({
	schema: z.object({
		label: z.string().default("Click me").describe("Button text"),
		variant: z.enum(["primary", "secondary", "outline"]).default("primary").describe("Button style"),
		size: z.enum(["sm", "md", "lg"]).default("md").describe("Button size"),
		disabled: z.boolean().default(false).describe("Disabled state"),
	}),
	render: ({ label, variant, size, disabled }) => {
		const variantStyles = {
			primary: "bg-blue-600 text-white hover:bg-blue-700",
			secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
			outline: "border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50",
		}
		const sizeStyles = {
			sm: "px-2 py-1 text-sm",
			md: "px-4 py-2",
			lg: "px-6 py-3 text-lg",
		}
		return (
			<button
				type="button"
				disabled={disabled}
				className={`rounded-md ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
			>
				{label}
			</button>
		)
	},
})
