"use client"

import { story, storyMatrix } from "nextbook"
import { z } from "zod"
import { Separator } from "@/components/ui/separator"

export const Matrix = storyMatrix({
	schema: z.object({
		orientation: z.enum(["horizontal", "vertical"]),
	}),
	render: ({ orientation }) =>
		orientation === "horizontal" ? (
			<div className="w-full">
				<Separator orientation="horizontal" />
			</div>
		) : (
			<div className="h-10">
				<Separator orientation="vertical" />
			</div>
		),
})

export const InContext = story({
	render: () => (
		<div>
			<div className="space-y-1">
				<h4 className="font-medium text-sm leading-none">Radix Primitives</h4>
				<p className="text-muted-foreground text-sm">An open-source UI component library.</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center space-x-4 text-sm">
				<div>Blog</div>
				<Separator orientation="vertical" />
				<div>Docs</div>
				<Separator orientation="vertical" />
				<div>Source</div>
			</div>
		</div>
	),
})
