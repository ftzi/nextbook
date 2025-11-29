import { story } from "nextbook"
import { z } from "zod"

export const Default = story({
	render: () => (
		<label className="flex cursor-pointer items-center gap-2">
			<input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
			<span className="text-gray-700">Accept terms and conditions</span>
		</label>
	),
})

export const Checked = story({
	render: () => (
		<label className="flex cursor-pointer items-center gap-2">
			<input
				type="checkbox"
				defaultChecked
				className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
			/>
			<span className="text-gray-700">Checked by default</span>
		</label>
	),
})

export const Disabled = story({
	render: () => (
		<label className="flex cursor-not-allowed items-center gap-2">
			<input type="checkbox" disabled className="h-4 w-4 cursor-not-allowed rounded border-gray-300 text-gray-400" />
			<span className="text-gray-400">Disabled checkbox</span>
		</label>
	),
})

export const Interactive = story({
	schema: z.object({
		label: z.string().default("Checkbox label").describe("Label text"),
		checked: z.boolean().default(false).describe("Checked state"),
		disabled: z.boolean().default(false).describe("Disabled state"),
	}),
	render: ({ label, checked, disabled }) => (
		<label className={`flex items-center gap-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
			<input
				type="checkbox"
				defaultChecked={checked}
				disabled={disabled}
				className={`h-4 w-4 rounded border-gray-300 focus:ring-blue-500 ${disabled ? "cursor-not-allowed text-gray-400" : "text-blue-600"}`}
			/>
			<span className={disabled ? "text-gray-400" : "text-gray-700"}>{label}</span>
		</label>
	),
})
