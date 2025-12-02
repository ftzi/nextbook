"use client"

import { motion } from "framer-motion"
import { Check, Copy, Github } from "lucide-react"
import { useState } from "react"
import { Container } from "@/components/shared/container"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { externalLinks } from "@/lib/public-routes"

const command = "npx nextbook"

export function CTA() {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(command)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<section className="relative overflow-hidden py-24">
			{/* Gradient background */}
			<div className="-z-10 pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-t from-brand-purple/10 via-transparent to-transparent" />
				<div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-brand-cyan/10 blur-[100px]" />
				<div className="absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-brand-pink/10 blur-[100px]" />
			</div>

			<Container>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="mx-auto max-w-2xl text-center"
				>
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
						Ready to simplify your <span className="gradient-text">component stories?</span>
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Join developers who chose the simpler path. Start documenting your components today.
					</p>

					{/* npm badge with gradient border */}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									onClick={handleCopy}
									className="relative mt-10 inline-flex cursor-pointer rounded-full bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink p-[1px] transition-opacity hover:opacity-80"
								>
									<div className="flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2">
										<code className="font-mono font-semibold text-sm">
											<span className="font-normal text-muted-foreground">npx</span> nextbook
										</code>
										{copied ? (
											<Check className="size-3.5 text-green-400" />
										) : (
											<Copy className="size-3.5 text-muted-foreground" />
										)}
									</div>
								</button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{copied ? "Copied!" : "Click to copy"}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<div className="mt-6 flex justify-center">
						<Button size="lg" variant="outline" asChild>
							<a href={externalLinks.github} target="_blank" rel="noopener noreferrer">
								<Github className="size-4" />
								GitHub
							</a>
						</Button>
					</div>
				</motion.div>
			</Container>
		</section>
	)
}
