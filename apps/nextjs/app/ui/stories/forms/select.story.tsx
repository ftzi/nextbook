"use client"

import { story, storyMatrix } from "@ftzi/storify"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export const Matrix = storyMatrix({
	schema: z.object({
		disabled: z.enum(["false", "true"]),
	}),
	render: ({ disabled }) => (
		<Select disabled={disabled === "true"}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select option" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="option1">Option 1</SelectItem>
				<SelectItem value="option2">Option 2</SelectItem>
				<SelectItem value="option3">Option 3</SelectItem>
			</SelectContent>
		</Select>
	),
})

export const Controlled = story({
	schema: z.object({
		placeholder: z.string().default("Select an option").describe("Placeholder text"),
		disabled: z.boolean().default(false).describe("Disabled state"),
	}),
	render: ({ placeholder, disabled }) => (
		<Select disabled={disabled}>
			<SelectTrigger className="w-[200px]">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="option1">Option 1</SelectItem>
				<SelectItem value="option2">Option 2</SelectItem>
				<SelectItem value="option3">Option 3</SelectItem>
			</SelectContent>
		</Select>
	),
})

export const WithGroups = story({
	render: () => (
		<Select>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Fruits</SelectLabel>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
					<SelectItem value="blueberry">Blueberry</SelectItem>
					<SelectItem value="grapes">Grapes</SelectItem>
					<SelectItem value="pineapple">Pineapple</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	),
})

export const WithLabel = story({
	render: () => (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="framework">Framework</Label>
			<Select>
				<SelectTrigger id="framework">
					<SelectValue placeholder="Select framework" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="next">Next.js</SelectItem>
					<SelectItem value="remix">Remix</SelectItem>
					<SelectItem value="astro">Astro</SelectItem>
					<SelectItem value="gatsby">Gatsby</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
})
