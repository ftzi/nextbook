"use client"

import { story, storyMatrix } from "@ftzi/storify"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export const Matrix = storyMatrix({
	schema: z.object({
		side: z.enum(["top", "right", "bottom", "left"]),
	}),
	render: ({ side }) => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline">{side}</Button>
			</TooltipTrigger>
			<TooltipContent side={side}>
				<p>Tooltip on {side}</p>
			</TooltipContent>
		</Tooltip>
	),
})

export const Controlled = story({
	schema: z.object({
		content: z.string().default("This is a tooltip").describe("Tooltip content"),
		side: z.enum(["top", "right", "bottom", "left"]).default("top").describe("Tooltip side"),
		triggerText: z.string().default("Hover me").describe("Trigger button text"),
	}),
	render: ({ content, side, triggerText }) => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline">{triggerText}</Button>
			</TooltipTrigger>
			<TooltipContent side={side}>
				<p>{content}</p>
			</TooltipContent>
		</Tooltip>
	),
})
