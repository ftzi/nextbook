import { story } from "nextbook"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const Default = story({
	render: () => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
			<CardFooter>
				<p>Card Footer</p>
			</CardFooter>
		</Card>
	),
})

export const WithForm = story({
	render: () => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create project</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<Input id="name" placeholder="Name of your project" />
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Deploy</Button>
			</CardFooter>
		</Card>
	),
})

export const Controlled = story({
	schema: z.object({
		title: z.string().default("Card Title").describe("Card title"),
		description: z.string().default("Card description goes here.").describe("Card description"),
		content: z.string().default("This is the card content area.").describe("Card content"),
		showFooter: z.boolean().default(true).describe("Show footer"),
	}),
	render: ({ title, description, content, showFooter }) => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{content}</p>
			</CardContent>
			{showFooter && (
				<CardFooter>
					<Button className="w-full">Action</Button>
				</CardFooter>
			)}
		</Card>
	),
})
