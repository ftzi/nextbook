"use client"

import { story } from "nextbook"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const Controlled = story({
	schema: z.object({
		triggerText: z.string().default("Open popover").describe("Trigger button text"),
		title: z.string().default("Popover Title").describe("Popover title"),
		content: z.string().default("This is the popover content.").describe("Popover content"),
	}),
	render: ({ triggerText, title, content }) => (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline">{triggerText}</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="space-y-2">
					<h4 className="font-medium leading-none">{title}</h4>
					<p className="text-muted-foreground text-sm">{content}</p>
				</div>
			</PopoverContent>
		</Popover>
	),
})

export const WithForm = story({
	render: () => (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline">Set Dimensions</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Dimensions</h4>
						<p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
					</div>
					<div className="grid gap-2">
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="width">Width</Label>
							<Input id="width" defaultValue="100%" className="col-span-2 h-8" />
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="maxWidth">Max. width</Label>
							<Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="height">Height</Label>
							<Input id="height" defaultValue="25px" className="col-span-2 h-8" />
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	),
})
