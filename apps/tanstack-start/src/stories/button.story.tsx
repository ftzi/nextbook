import { story } from "@ftzi/storify"
import { z } from "zod"

export const Default = story({
	render: () => (
		<button
			type="button"
			style={{
				padding: "8px 16px",
				backgroundColor: "#3b82f6",
				color: "white",
				border: "none",
				borderRadius: "6px",
				cursor: "pointer",
			}}
		>
			Click me
		</button>
	),
})

export const Controlled = story({
	schema: z.object({
		label: z.string().default("Click me"),
		variant: z.enum(["primary", "secondary", "danger"]).default("primary"),
		disabled: z.boolean().default(false),
	}),
	render: ({ label, variant, disabled }) => {
		const colors = {
			primary: "#3b82f6",
			secondary: "#6b7280",
			danger: "#ef4444",
		}
		return (
			<button
				type="button"
				disabled={disabled}
				style={{
					padding: "8px 16px",
					backgroundColor: colors[variant],
					color: "white",
					border: "none",
					borderRadius: "6px",
					cursor: disabled ? "not-allowed" : "pointer",
					opacity: disabled ? 0.5 : 1,
				}}
			>
				{label}
			</button>
		)
	},
})
