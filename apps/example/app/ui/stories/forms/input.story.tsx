import { story } from "nextbook"
import { z } from "zod"

export const Default = story({
	render: () => (
		<input
			type="text"
			placeholder="Enter text..."
			className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
		/>
	),
})

export const WithLabel = story({
	render: () => (
		<label className="flex flex-col gap-1.5">
			<span className="font-medium text-gray-700 text-sm">Email</span>
			<input
				type="email"
				placeholder="you@example.com"
				className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			/>
		</label>
	),
})

export const Disabled = story({
	render: () => (
		<input
			type="text"
			disabled
			placeholder="Disabled input"
			className="cursor-not-allowed rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500"
		/>
	),
})

export const WithError = story({
	render: () => (
		<label className="flex flex-col gap-1.5">
			<span className="font-medium text-gray-700 text-sm">Password</span>
			<input
				type="password"
				className="rounded-md border-2 border-red-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20"
			/>
			<span className="text-red-500 text-sm">Password must be at least 8 characters</span>
		</label>
	),
})

export const Interactive = story({
	schema: z.object({
		placeholder: z.string().default("Enter text...").describe("Placeholder text"),
		type: z.enum(["text", "email", "password", "number"]).default("text").describe("Input type"),
		disabled: z.boolean().default(false).describe("Disabled state"),
		hasError: z.boolean().default(false).describe("Show error state"),
	}),
	render: ({ placeholder, type, disabled, hasError }) => (
		<input
			type={type}
			placeholder={placeholder}
			disabled={disabled}
			className={`rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${
				hasError
					? "border-2 border-red-500 focus:ring-red-500/20"
					: "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
			} ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
		/>
	),
})
