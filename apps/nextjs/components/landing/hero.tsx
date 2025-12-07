"use client"

import { motion } from "framer-motion"
import { ArrowRight, Check, GithubIcon, Package, Timer } from "lucide-react"
import Image from "next/image"
import { Container } from "@/components/shared/container"
import { LiveDemoButton } from "@/components/shared/live-demo-button"
import { Button } from "@/components/ui/button"
import { externalLinks } from "@/lib/public-routes"

export function Hero() {
	return (
		<section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
			{/* Geometric background */}
			<div className="-z-10 pointer-events-none absolute inset-0">
				{/* Grid */}
				<div
					className="absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage: `
							linear-gradient(to right, currentColor 1px, transparent 1px),
							linear-gradient(to bottom, currentColor 1px, transparent 1px)
						`,
						backgroundSize: "60px 60px",
					}}
				/>

				{/* Radial gradient fade at edges */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />

				{/* Geometric accent shapes */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.2 }}
					className="absolute top-20 left-[10%] h-px w-40 bg-gradient-to-r from-brand-cyan to-transparent"
				/>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.2 }}
					className="absolute top-20 left-[10%] h-40 w-px bg-gradient-to-b from-brand-cyan to-transparent"
				/>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.4 }}
					className="absolute top-32 right-[15%] h-px w-32 bg-gradient-to-l from-brand-purple to-transparent"
				/>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.4 }}
					className="absolute top-32 right-[15%] h-32 w-px bg-gradient-to-b from-brand-purple to-transparent"
				/>

				{/* Accent dots */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="absolute top-20 left-[10%] size-2 rounded-full bg-brand-cyan shadow-[0_0_20px_6px] shadow-brand-cyan/40"
				/>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.8 }}
					className="absolute top-32 right-[15%] size-2 rounded-full bg-brand-purple shadow-[0_0_20px_6px] shadow-brand-purple/40"
				/>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 1 }}
					className="absolute bottom-40 left-[20%] size-1.5 rounded-full bg-brand-pink shadow-[0_0_16px_4px] shadow-brand-pink/40"
				/>

				{/* Diagonal accent line */}
				<svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<defs>
						<linearGradient id="heroLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="var(--color-brand-cyan)" stopOpacity="0.3" />
							<stop offset="50%" stopColor="var(--color-brand-purple)" stopOpacity="0.2" />
							<stop offset="100%" stopColor="var(--color-brand-pink)" stopOpacity="0" />
						</linearGradient>
					</defs>
					<motion.line
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 1 }}
						transition={{ duration: 1.5, delay: 0.5 }}
						x1="10%"
						y1="15%"
						x2="90%"
						y2="85%"
						stroke="url(#heroLineGradient)"
						strokeWidth="1"
					/>
				</svg>
			</div>

			<Container>
				<div className="mx-auto max-w-4xl text-center">
					{/* Headline */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl"
					>
						Next-gen component stories
						<br />
						<span className="gradient-text">for React frameworks</span>
					</motion.h1>

					{/* Subheadline */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
					>
						Build interactive component documentation without leaving your React app.
					</motion.p>

					{/* Stats badges */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mt-8 flex flex-wrap items-center justify-center gap-3"
					>
						<div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 py-1.5 pr-5 pl-4 text-sm">
							<Package className="size-3.5 text-brand-cyan" />
							<span className="text-muted-foreground">Zero dependencies</span>
						</div>
						<div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 py-1.5 pr-5 pl-4 text-sm">
							<Timer className="size-3.5 text-brand-purple" />
							<span className="text-muted-foreground">5 min setup</span>
						</div>
						<div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 py-1.5 pr-5 pl-4 text-sm">
							<Check className="size-3.5 text-brand-pink" />
							<span className="text-muted-foreground">Full TypeScript</span>
						</div>
					</motion.div>

					{/* Separator */}
					<motion.div
						initial={{ opacity: 0, scaleX: 0 }}
						animate={{ opacity: 1, scaleX: 1 }}
						transition={{ duration: 0.6, delay: 0.25 }}
						className="mx-auto mt-8 h-px w-48 bg-linear-to-r from-brand-cyan/50 via-brand-purple/50 to-brand-pink/50"
					/>

					{/* CTAs */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
					>
						<Button size="lg" variant="outline" asChild>
							<a href={externalLinks.github} target="_blank" rel="noopener noreferrer">
								<GithubIcon className="size-4" />
								GitHub
							</a>
						</Button>
						<LiveDemoButton size="lg" />
						<Button size="lg" asChild>
							<a href="#quickstart">
								Get Started
								<ArrowRight className="size-4" />
							</a>
						</Button>
					</motion.div>

					{/* Storify UI screenshot - auto-generated by e2e/marketing-screenshots.e2e.ts */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.5 }}
						className="mt-16"
					>
						<div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border/50 shadow-2xl">
							<Image
								src="/images/hero-screenshot.png"
								alt="Storify UI showing component stories with interactive controls"
								width={1200}
								height={800}
								className="h-auto w-full"
								priority
							/>
						</div>
					</motion.div>
				</div>
			</Container>
		</section>
	)
}
