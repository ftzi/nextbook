"use client"

import { motion } from "framer-motion"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Container } from "@/components/shared/container"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function CTA() {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText("npx nextbook")
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<section className="relative overflow-hidden py-24">
			{/* Geometric background */}
			<div className="-z-10 pointer-events-none absolute inset-0">
				{/* Diagonal lines pattern */}
				<svg
					className="absolute inset-0 h-full w-full opacity-[0.04]"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<defs>
						<pattern id="ctaDiagonalLines" patternUnits="userSpaceOnUse" width="60" height="60">
							<path d="M-15,15 l30,-30 M0,60 l60,-60 M45,75 l30,-30" stroke="currentColor" strokeWidth="1" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#ctaDiagonalLines)" />
				</svg>

				{/* Accent elements */}
				<div className="-translate-x-1/2 absolute top-0 left-1/2 h-px w-1/3 bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent" />
				<div className="-translate-x-1/2 absolute bottom-0 left-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />

				{/* Corner accents */}
				<div className="absolute top-8 left-8 size-1 rounded-full bg-brand-cyan shadow-[0_0_12px_4px] shadow-brand-cyan/30" />
				<div className="absolute top-8 right-8 size-1 rounded-full bg-brand-purple shadow-[0_0_12px_4px] shadow-brand-purple/30" />
				<div className="absolute bottom-8 left-1/3 size-1 rounded-full bg-brand-pink shadow-[0_0_12px_4px] shadow-brand-pink/30" />
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
				</motion.div>
			</Container>
		</section>
	)
}
