"use client"

import { motion } from "framer-motion"
import { Check, Copy, Terminal } from "lucide-react"
import { useState } from "react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Button } from "@/components/ui/button"

const command = "npx @ftzi/storify"

export function QuickStart() {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(command)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Section id="quickstart" variant="mesh">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Get started in seconds</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						One command sets up everything you need. No configuration required.
					</p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="mx-auto mt-12 max-w-xl"
				>
					{/* Terminal command */}
					<div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-brand-purple/10">
						<div className="flex items-center justify-between border-white/5 border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<div className="flex gap-1.5">
									<div className="size-3 rounded-full bg-[#FF5F56]" />
									<div className="size-3 rounded-full bg-[#FFBD2E]" />
									<div className="size-3 rounded-full bg-[#27C93F]" />
								</div>
								<div className="ml-2 flex items-center gap-1.5">
									<Terminal className="size-3.5 text-zinc-500" />
									<span className="text-xs text-zinc-500">Terminal</span>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="h-7 gap-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
								onClick={handleCopy}
							>
								{copied ? (
									<>
										<Check className="size-3.5 text-green-400" />
										<span className="text-green-400">Copied!</span>
									</>
								) : (
									<>
										<Copy className="size-3.5" />
										<span>Copy</span>
									</>
								)}
							</Button>
						</div>
						<div className="p-6">
							<code className="font-mono text-lg">
								<span className="text-brand-cyan">$</span> <span className="text-white">{command}</span>
							</code>
						</div>
					</div>

					{/* Steps */}
					<div className="mt-10 space-y-4">
						{[
							{ step: "1", content: "Run the command in your React project" },
							{
								step: "2",
								content: (
									<>
										Write stories — or <span className="font-semibold text-white">let AI generate them for you</span>
									</>
								),
							},
							{ step: "3", content: "Visit localhost:3000/ui to see them live" },
						].map((item) => (
							<motion.div
								key={item.step}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: Number(item.step) * 0.1 }}
								className="flex items-center gap-4"
							>
								<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-purple to-brand-pink font-bold font-mono text-sm text-white shadow-brand-purple/20 shadow-lg">
									{item.step}
								</div>
								<p className="text-muted-foreground">{item.content}</p>
							</motion.div>
						))}
					</div>
				</motion.div>
			</Container>
		</Section>
	)
}
