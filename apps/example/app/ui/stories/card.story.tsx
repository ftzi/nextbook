import { story } from "nextbook"
import { z } from "zod"

export const Default = story({
	render: () => (
		<div className="w-80 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 className="mb-2 font-semibold text-lg">Card Title</h3>
			<p className="text-gray-600">This is a simple card component with some content inside.</p>
		</div>
	),
})

export const WithImage = story({
	render: () => (
		<div className="w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500" />
			<div className="p-6">
				<h3 className="mb-2 font-semibold text-lg">Featured Card</h3>
				<p className="text-gray-600">A card with a colorful header section.</p>
			</div>
		</div>
	),
})

export const Interactive = story({
	schema: z.object({
		title: z.string().default("Card Title").describe("Card title"),
		description: z.string().default("Card description goes here.").describe("Card description"),
		showBorder: z.boolean().default(true).describe("Show border"),
		showShadow: z.boolean().default(true).describe("Show shadow"),
	}),
	render: ({ title, description, showBorder, showShadow }) => (
		<div
			className={`w-80 rounded-lg bg-white p-6 ${showBorder ? "border border-gray-200" : ""} ${showShadow ? "shadow-sm" : ""}`}
		>
			<h3 className="mb-2 font-semibold text-lg">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</div>
	),
})
