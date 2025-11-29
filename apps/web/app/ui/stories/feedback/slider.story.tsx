"use client"

import { story } from "nextbook"
import { z } from "zod"
import { Slider } from "@/components/ui/slider"

export const Default = story({
	render: () => <Slider defaultValue={[50]} max={100} step={1} className="w-[60%]" />,
})

export const Range = story({
	render: () => <Slider defaultValue={[25, 75]} max={100} step={1} className="w-[60%]" />,
})

export const WithSteps = story({
	render: () => <Slider defaultValue={[50]} max={100} step={10} className="w-[60%]" />,
})

export const Disabled = story({
	render: () => <Slider defaultValue={[50]} max={100} step={1} disabled className="w-[60%]" />,
})

export const Controlled = story({
	schema: z.object({
		defaultValue: z.number().min(0).max(100).default(50).describe("Default value"),
		max: z.number().min(10).max(1000).default(100).describe("Maximum value"),
		step: z.number().min(1).max(50).default(1).describe("Step increment"),
		disabled: z.boolean().default(false).describe("Disabled state"),
	}),
	render: ({ defaultValue, max, step, disabled }) => (
		<Slider defaultValue={[defaultValue]} max={max} step={step} disabled={disabled} className="w-[60%]" />
	),
})
