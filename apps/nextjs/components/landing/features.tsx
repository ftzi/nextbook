"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Bot, Feather, Grid3X3, Layers, Plug, Settings2, Sparkles, Zap } from "lucide-react"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"

type Feature = {
	icon: LucideIcon
	title: string
	description: string
	gradient: string
}

const features: Feature[] = [
	{
		icon: Feather,
		title: "Zero Dependencies",
		description:
			"No runtime dependencies whatsoever. Just your Next.js app. No version conflicts, no security vulnerabilities from transitive deps.",
		gradient: "from-brand-cyan to-brand-cyan/60",
	},
	{
		icon: Zap,
		title: "Zero Config",
		description:
			"Uses your Next.js app's existing setup. No separate build process, no Tailwind duplication, no webpack config.",
		gradient: "from-brand-purple to-brand-purple/60",
	},
	{
		icon: Settings2,
		title: "Zod Controls",
		description:
			"Auto-generate interactive controls from Zod schemas. Define your props once, get type-safe documentation.",
		gradient: "from-brand-pink to-brand-pink/60",
	},
	{
		icon: Grid3X3,
		title: "Story Matrix",
		description: "Automatically generate ALL prop combinations. Never miss a variant again - 100% coverage guaranteed.",
		gradient: "from-brand-cyan to-brand-purple",
	},
	{
		icon: Layers,
		title: "Lazy Loading",
		description: "Stories load on-demand for blazing fast startup. Only load what you're viewing.",
		gradient: "from-brand-purple to-brand-pink",
	},
	{
		icon: Sparkles,
		title: "Background Switcher",
		description:
			"Toggle between default and striped backgrounds to spot component imperfections and transparency issues.",
		gradient: "from-brand-pink to-brand-cyan",
	},
	{
		icon: Plug,
		title: "API Mocking",
		description: "Optional MSW integration to mock API endpoints in stories. Test components without real backends.",
		gradient: "from-brand-cyan to-brand-pink",
	},
	{
		icon: Bot,
		title: "AI-First",
		description:
			'Generates CLAUDE.md and AGENTS.md files that teach AI assistants how to write stories. Just say "write a story for Button" and it works.',
		gradient: "from-brand-purple to-brand-cyan",
	},
]

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			staggerChildren: 0.05,
		},
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4 },
	},
}

export function Features() {
	return (
		<Section id="features" variant="dots">
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
					className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
				>
					{features.map((feature) => (
						<motion.div
							key={feature.title}
							variants={itemVariants}
							className="group relative rounded-2xl border border-border/40 bg-background/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-background/80 hover:shadow-brand-purple/5 hover:shadow-lg"
						>
							<div
								className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 shadow-black/10 shadow-lg`}
							>
								<feature.icon className="size-5 text-white" />
							</div>
							<h3 className="font-semibold text-base">{feature.title}</h3>
							<p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
						</motion.div>
					))}
				</motion.div>
			</Container>
		</Section>
	)
}
