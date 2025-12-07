"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy, Grid3X3, Sparkles } from "lucide-react"
import { useState } from "react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { codeExamples, type TabId } from "./code-examples"

const tabs = [
	{ id: "basic", label: "Basic Story" },
	{ id: "controls", label: "With Zod Controls" },
	{ id: "matrix", label: "Story Matrix" },
] as const

function CodeBlock({ code, html }: { code: string; html: string }) {
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
				className="absolute top-3 right-3 z-10 size-8 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
				onClick={handleCopy}
			>
				{copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
			</Button>
			<div
				className="overflow-x-auto [&_pre]:bg-transparent! [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	)
}

type HighlightedCode = Record<TabId, string>

export function CodeDemo({ highlightedCode }: { highlightedCode: HighlightedCode }) {
	const [activeTab, setActiveTab] = useState<TabId>("basic")

	return (
		<Section id="code">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Simple, powerful API</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Write stories in TypeScript with full IntelliSense. No magic strings, no decorators.
					</p>
				</div>

				<div className="mx-auto mt-12 max-w-3xl">
					{/* Code block with tabs */}
					<div className="overflow-hidden rounded-xl border border-border/50 bg-zinc-950">
						{/* Tab bar */}
						<div className="flex border-border/30 border-b bg-zinc-900/50">
							{tabs.map((tab) => (
								<button
									type="button"
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={cn(
										"relative cursor-pointer px-5 py-3 font-medium text-sm transition-colors",
										activeTab === tab.id ? "text-brand-cyan" : "text-zinc-500 hover:text-zinc-300",
									)}
								>
									{activeTab === tab.id && (
										<motion.div
											layoutId="activeTab"
											className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-brand-cyan to-brand-purple"
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
								<CodeBlock code={codeExamples[activeTab]} html={highlightedCode[activeTab]} />
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Feature highlight for matrix */}
					{activeTab === "matrix" && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mt-4 flex items-center gap-4 rounded-lg border border-brand-purple/30 bg-brand-purple/5 px-5 py-4"
						>
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-purple/20">
								<Grid3X3 className="size-5 text-brand-purple" />
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<p className="font-medium text-foreground text-sm">One line, 24 stories</p>
									<Sparkles className="size-3.5 text-brand-purple" />
								</div>
								<p className="mt-0.5 text-muted-foreground text-xs">
									4 variants × 3 sizes × 2 loading states = visual grid of every combination
								</p>
							</div>
						</motion.div>
					)}
				</div>
			</Container>
		</Section>
	)
}
