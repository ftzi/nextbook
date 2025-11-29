"use client"

import { story, storyMatrix } from "nextbook"
import { z } from "zod"
import { Progress } from "@/components/ui/progress"

export const Default = story({
	render: () => <Progress value={33} className="w-[60%]" />,
})

export const Empty = story({
	render: () => <Progress value={0} className="w-[60%]" />,
})

export const Half = story({
	render: () => <Progress value={50} className="w-[60%]" />,
})

export const Full = story({
	render: () => <Progress value={100} className="w-[60%]" />,
})

export const Controlled = story({
	schema: z.object({
		value: z.number().min(0).max(100).default(50).describe("Progress value (0-100)"),
	}),
	render: ({ value }) => <Progress value={value} className="w-[60%]" />,
})

export const Matrix = storyMatrix({
	schema: z.object({
		value: z.enum(["0", "25", "50", "75", "100"]),
	}),
	render: ({ value }) => <Progress value={Number.parseInt(value, 10)} className="w-[200px]" />,
})
