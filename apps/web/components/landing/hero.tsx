"use client"

import { motion } from "framer-motion"
import { ArrowRight, Blocks, Github, Sparkles } from "lucide-react"
import { Container } from "@/components/shared/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { externalLinks } from "@/lib/public-routes"

export function Hero() {
	return (
		<section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
			{/* Animated gradient background */}
			<div className="-z-10 pointer-events-none absolute inset-0">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
					className="-translate-x-1/2 absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-brand-cyan/20 blur-[100px]"
				/>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 0.2 }}
					className="absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-brand-purple/20 blur-[100px]"
				/>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 0.4 }}
					className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-brand-pink/20 blur-[100px]"
				/>
			</div>

			<Container>
				<div className="mx-auto max-w-4xl text-center">
					{/* Badge */}
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
						<Badge variant="outline" className="mb-6 gap-2 border-brand-purple/30 bg-brand-purple/10 px-4 py-1.5">
							<Sparkles className="size-3.5 text-brand-purple" />
							<span className="text-sm">The Storybook alternative for Next.js</span>
						</Badge>
					</motion.div>

					{/* Headline */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl"
					>
						Next-gen component stories
						<br />
						<span className="gradient-text">for Next.js</span>
					</motion.h1>

					{/* Subheadline */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
					>
						Build interactive component documentation without leaving your Next.js app. Zod-powered controls, automatic
						story matrix, and AI-ready API.
					</motion.p>

					{/* CTAs */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
					>
						<Button size="lg" asChild>
							<a href="#quickstart">
								Get Started
								<ArrowRight className="size-4" />
							</a>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<a href="/ui">
								<Blocks className="size-4" />
								Live Demo
							</a>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<a href={externalLinks.github} target="_blank" rel="noopener noreferrer">
								<Github className="size-4" />
								GitHub
							</a>
						</Button>
					</motion.div>

					{/* Terminal preview placeholder */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.5 }}
						className="mt-16"
					>
						<div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur">
							<div className="flex items-center gap-2 border-border/50 border-b px-4 py-3">
								<div className="size-3 rounded-full bg-red-500/80" />
								<div className="size-3 rounded-full bg-yellow-500/80" />
								<div className="size-3 rounded-full bg-green-500/80" />
								<span className="ml-2 text-muted-foreground text-xs">Terminal</span>
							</div>
							<div className="p-6 font-mono text-sm">
								<p className="text-muted-foreground">
									<span className="text-brand-cyan">$</span> npx nextbook
								</p>
								<p className="mt-2 text-muted-foreground">
									<span className="text-green-400">✓</span> Created app/ui/layout.tsx
								</p>
								<p className="text-muted-foreground">
									<span className="text-green-400">✓</span> Created app/ui/[[...path]]/page.tsx
								</p>
								<p className="text-muted-foreground">
									<span className="text-green-400">✓</span> Created app/ui/stories/index.ts
								</p>
								<p className="text-muted-foreground">
									<span className="text-green-400">✓</span> Created app/ui/stories/example.story.tsx
								</p>
								<p className="mt-2 text-brand-purple">Ready! Visit http://localhost:3000/ui</p>
							</div>
						</div>
					</motion.div>

					{/* Screenshot placeholder */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.7 }}
						className="mt-12"
					>
						{/*
							SCREENSHOT PLACEHOLDER: hero-screenshot.png (1200x800)
							Full nextbook UI showing sidebar + story viewer with controls panel visible.
							Dark mode preferred for visual impact.
						*/}
						<div className="mx-auto aspect-[3/2] max-w-4xl overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 shadow-2xl">
							<div className="flex h-full items-center justify-center text-muted-foreground">
								<div className="text-center">
									<p className="font-medium text-lg">Screenshot Placeholder</p>
									<p className="mt-1 text-sm">hero-screenshot.png (1200x800)</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</Container>
		</section>
	)
}
