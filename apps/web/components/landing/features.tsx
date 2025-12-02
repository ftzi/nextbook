"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Bot, Grid3X3, Layers, Plug, Settings2, Sparkles, Zap } from "lucide-react"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"

type Feature = {
	icon: LucideIcon
	title: string
	description: string
}

const features: Feature[] = [
	{
		icon: Zap,
		title: "Zero Config",
		description:
			"Uses your Next.js app's existing setup. No separate build process, no Tailwind duplication, no webpack config.",
	},
	{
		icon: Settings2,
		title: "Zod Controls",
		description:
			"Auto-generate interactive controls from Zod schemas. Define your props once, get type-safe documentation.",
	},
	{
		icon: Grid3X3,
		title: "Story Matrix",
		description: "Automatically generate ALL prop combinations. Never miss a variant again - 100% coverage guaranteed.",
	},
	{
		icon: Layers,
		title: "Lazy Loading",
		description: "Stories load on-demand for blazing fast startup. Only load what you're viewing.",
	},
	{
		icon: Sparkles,
		title: "Background Switcher",
		description:
			"Toggle between default and striped backgrounds to spot component imperfections and transparency issues.",
	},
	{
		icon: Plug,
		title: "API Mocking",
		description: "Optional MSW integration to mock API endpoints in stories. Test components without real backends.",
	},
	{
		icon: Bot,
		title: "AI-Ready",
		description:
			"Simple, predictable API that AI assistants can use to generate stories instantly. No complex configuration.",
	},
]

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 },
	},
}

export function Features() {
	return (
		<Section id="features" background="muted">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Everything you need to document components</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Stop wasting time on boilerplate. Start building what makes your components shine.
					</p>
				</div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
				>
					{features.map((feature) => (
						<motion.div
							key={feature.title}
							variants={itemVariants}
							className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur transition-all hover:border-border hover:bg-card hover:shadow-lg"
						>
							<div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-brand-cyan/10 via-brand-purple/10 to-brand-pink/10 p-3">
								<feature.icon className="size-6 text-brand-purple" />
							</div>
							<h3 className="font-semibold text-lg">{feature.title}</h3>
							<p className="mt-2 text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
						</motion.div>
					))}
				</motion.div>
			</Container>
		</Section>
	)
}
