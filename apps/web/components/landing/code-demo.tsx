"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabs = [
	{ id: "basic", label: "Basic Story" },
	{ id: "controls", label: "With Zod Controls" },
	{ id: "matrix", label: "Story Matrix" },
] as const

type TabId = (typeof tabs)[number]["id"]

const codeExamples: Record<TabId, string> = {
	basic: `import { story } from "nextbook"
import { Button } from "@/components/ui/button"

export const Default = story({
  render: () => <Button>Click me</Button>,
})`,
	controls: `import { story } from "nextbook"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const Controlled = story({
  schema: z.object({
    variant: z.enum(["primary", "secondary"]).default("primary"),
    disabled: z.boolean().default(false),
    children: z.string().default("Click me"),
  }),
  render: (props) => <Button {...props} />,
})`,
	matrix: `import { storyMatrix } from "nextbook"
import { z } from "zod"
import { Button } from "@/components/ui/button"

// Generates ALL 12 combinations automatically!
// (3 variants × 2 sizes × 2 disabled states)
export const Matrix = storyMatrix({
  schema: z.object({
    variant: z.enum(["primary", "secondary", "ghost"]),
    size: z.enum(["sm", "lg"]),
    disabled: z.boolean(),
  }),
  render: (props) => <Button {...props}>Click me</Button>,
})`,
}

function CodeBlock({ code }: { code: string }) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="relative">
			<Button
				variant="ghost"
				size="icon"
				className="absolute top-3 right-3 size-8 opacity-50 hover:opacity-100"
				onClick={handleCopy}
			>
				{copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
			</Button>
			<pre className="overflow-x-auto rounded-lg bg-zinc-950 p-6 font-mono text-sm leading-relaxed">
				<code className="text-zinc-300">{code}</code>
			</pre>
		</div>
	)
}

export function CodeDemo() {
	const [activeTab, setActiveTab] = useState<TabId>("basic")

	return (
		<Section id="code" background="gradient">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Simple, powerful API</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Write stories in TypeScript with full IntelliSense. No magic strings, no decorators.
					</p>
				</div>

				<div className="mx-auto mt-12 max-w-3xl">
					{/* Tabs */}
					<div className="mb-4 flex gap-2 rounded-lg bg-muted/50 p-1">
						{tabs.map((tab) => (
							<button
								type="button"
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"relative flex-1 rounded-md px-4 py-2 font-medium text-sm transition-colors",
									activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
								)}
							>
								{activeTab === tab.id && (
									<motion.div
										layoutId="activeTab"
										className="absolute inset-0 rounded-md bg-background shadow-sm"
										transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
									/>
								)}
								<span className="relative z-10">{tab.label}</span>
							</button>
						))}
					</div>

					{/* Code */}
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							<CodeBlock code={codeExamples[activeTab]} />
						</motion.div>
					</AnimatePresence>

					{/* Feature highlight for matrix */}
					{activeTab === "matrix" && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mt-4 rounded-lg border border-brand-purple/30 bg-brand-purple/10 p-4"
						>
							<p className="text-brand-purple text-sm">
								<strong>Game-changer:</strong> Story Matrix generates all prop combinations automatically. No more
								writing PrimarySmall, PrimaryLarge, SecondarySmall...
							</p>
						</motion.div>
					)}
				</div>
			</Container>
		</Section>
	)
}
