"use client"

import { motion } from "framer-motion"
import { Check, Copy, Terminal } from "lucide-react"
import { useState } from "react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Button } from "@/components/ui/button"

const command = "npx nextbook"

export function QuickStart() {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(command)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Section id="quickstart" background="muted">
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
					<div className="overflow-hidden rounded-xl border border-border/50 bg-zinc-950 shadow-2xl">
						<div className="flex items-center justify-between border-zinc-800 border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<Terminal className="size-4 text-zinc-400" />
								<span className="text-sm text-zinc-400">Terminal</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="h-7 gap-1.5 text-zinc-400 hover:text-white"
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
					<div className="mt-8 space-y-4">
						{[
							{ step: "1", text: "Run the command in your Next.js project" },
							{ step: "2", text: "Visit localhost:3000/ui to see your stories" },
							{ step: "3", text: "Write stories with full TypeScript support" },
						].map((item) => (
							<motion.div
								key={item.step}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: Number(item.step) * 0.1 }}
								className="flex items-center gap-4"
							>
								<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-purple/20 font-bold font-mono text-brand-purple text-sm">
									{item.step}
								</div>
								<p className="text-muted-foreground">{item.text}</p>
							</motion.div>
						))}
					</div>
				</motion.div>
			</Container>
		</Section>
	)
}
