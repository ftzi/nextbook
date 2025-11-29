"use client"

import { motion } from "framer-motion"
import { ArrowRight, Github } from "lucide-react"
import { Container } from "@/components/shared/container"
import { Button } from "@/components/ui/button"
import { externalLinks } from "@/lib/public-routes"

export function CTA() {
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

					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button size="lg" asChild>
							<a href="#quickstart">
								Get Started
								<ArrowRight className="size-4" />
							</a>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<a href={externalLinks.github} target="_blank" rel="noopener noreferrer">
								<Github className="size-4" />
								Star on GitHub
							</a>
						</Button>
					</div>

					{/* npm badge */}
					<div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-2">
						<code className="font-mono text-sm">npm install nextbook</code>
					</div>
				</motion.div>
			</Container>
		</section>
	)
}
