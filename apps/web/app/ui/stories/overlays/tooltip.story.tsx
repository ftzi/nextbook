"use client"

import { story } from "nextbook"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export const Default = story({
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline">Hover me</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Add to library</p>
			</TooltipContent>
		</Tooltip>
	),
})

export const Sides = story({
	render: () => (
		<div className="flex gap-4">
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline">Top</Button>
				</TooltipTrigger>
				<TooltipContent side="top">
					<p>Top tooltip</p>
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline">Right</Button>
				</TooltipTrigger>
				<TooltipContent side="right">
					<p>Right tooltip</p>
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline">Bottom</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>Bottom tooltip</p>
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline">Left</Button>
				</TooltipTrigger>
				<TooltipContent side="left">
					<p>Left tooltip</p>
				</TooltipContent>
			</Tooltip>
		</div>
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
