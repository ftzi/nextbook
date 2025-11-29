"use client"

import { story, storyMatrix } from "nextbook"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const Default = story({
	render: () => (
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	),
})

export const Fallback = story({
	render: () => (
		<Avatar>
			<AvatarImage src="https://invalid-url.png" alt="User" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
})

export const Sizes = story({
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar className="size-8">
				<AvatarImage src="https://github.com/shadcn.png" alt="Small" />
				<AvatarFallback>SM</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" alt="Medium" />
				<AvatarFallback>MD</AvatarFallback>
			</Avatar>
			<Avatar className="size-14">
				<AvatarImage src="https://github.com/shadcn.png" alt="Large" />
				<AvatarFallback>LG</AvatarFallback>
			</Avatar>
			<Avatar className="size-20">
				<AvatarImage src="https://github.com/shadcn.png" alt="XL" />
				<AvatarFallback>XL</AvatarFallback>
			</Avatar>
		</div>
	),
})

export const Group = story({
	render: () => (
		<div className="-space-x-4 flex">
			<Avatar className="border-2 border-background">
				<AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
				<AvatarFallback>U1</AvatarFallback>
			</Avatar>
			<Avatar className="border-2 border-background">
				<AvatarImage src="https://github.com/vercel.png" alt="User 2" />
				<AvatarFallback>U2</AvatarFallback>
			</Avatar>
			<Avatar className="border-2 border-background">
				<AvatarImage src="https://github.com/tailwindcss.png" alt="User 3" />
				<AvatarFallback>U3</AvatarFallback>
			</Avatar>
			<Avatar className="border-2 border-background">
				<AvatarFallback>+3</AvatarFallback>
			</Avatar>
		</div>
	),
})

export const Controlled = story({
	schema: z.object({
		src: z.string().default("https://github.com/shadcn.png").describe("Image URL"),
		fallback: z.string().default("CN").describe("Fallback text (2 chars)"),
	}),
	render: ({ src, fallback }) => (
		<Avatar>
			<AvatarImage src={src} alt="Avatar" />
			<AvatarFallback>{fallback}</AvatarFallback>
		</Avatar>
	),
})

export const Matrix = storyMatrix({
	schema: z.object({
		size: z.enum(["sm", "md", "lg"]),
		hasImage: z.boolean(),
	}),
	render: ({ size, hasImage }) => {
		const sizeClasses = { sm: "size-8", md: "size-10", lg: "size-14" }
		return (
			<Avatar className={sizeClasses[size]}>
				{hasImage ? <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" /> : null}
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		)
	},
})
