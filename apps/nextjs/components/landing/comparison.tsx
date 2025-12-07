"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { cn } from "@/lib/utils"

type ComparisonRow = {
	feature: string
	storybook: string | boolean
	storify: string | boolean
	highlight?: boolean
}

const comparisons: ComparisonRow[] = [
	{ feature: "Runtime dependencies", storybook: "100+ packages", storify: "Zero" },
	{ feature: "Setup", storybook: "Hours of config", storify: "npx @ftzi/storify" },
	{ feature: "Separate build process", storybook: "Yes", storify: "No" },
	{ feature: "Config files", storybook: ".storybook/*, main.js...", storify: "None" },
	{ feature: "Dev server", storybook: "Separate process", storify: "Your app's dev server" },
	{ feature: "AI assistant support", storybook: "No", storify: "Yes", highlight: true },
	{ feature: "Hosting", storybook: "Separate deployment", storify: "Same as your app", highlight: true },
	{ feature: "Renders same as production", storybook: "No", storify: "Yes", highlight: true },
	{ feature: "Story matrix", storybook: "No", storify: "Yes", highlight: true },
]

function ValueCell({ value, isStorify }: { value: string | boolean; isStorify: boolean }) {
	if (typeof value === "boolean") {
		return value ? (
			<X className={cn("size-5", isStorify ? "text-red-400" : "text-muted-foreground")} />
		) : (
			<Check className={cn("size-5", isStorify ? "text-green-400" : "text-muted-foreground")} />
		)
	}

	if (isStorify) {
		return (
			<span className="inline-flex items-center gap-1.5 font-medium text-foreground">
				{value}
				<Check className="size-4 text-green-400" />
			</span>
		)
	}

	return <span className="text-muted-foreground">{value}</span>
}

export function Comparison() {
	return (
		<Section id="comparison">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
						Why <span className="gradient-text">Storify</span> over Storybook?
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">Built for React frameworks. No compromises.</p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur"
				>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-border/50 border-b">
									<th className="px-6 py-4 text-left font-medium text-muted-foreground text-sm">Feature</th>
									<th className="px-6 py-4 text-center font-medium text-muted-foreground text-sm">Storybook</th>
									<th className="px-6 py-4 text-center font-medium text-sm">
										<span className="gradient-text">Storify</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{comparisons.map((row, _index) => (
									<tr
										key={row.feature}
										className={cn("border-border/30 border-b last:border-0", row.highlight && "bg-brand-purple/5")}
									>
										<td className="px-6 py-4 text-sm">
											{row.feature}
											{row.highlight && <span className="ml-2 text-brand-purple text-xs">★</span>}
										</td>
										<td className="px-6 py-4 text-center text-muted-foreground text-sm">
											<div className="flex items-center justify-center">
												<ValueCell value={row.storybook} isStorify={false} />
											</div>
										</td>
										<td className="px-6 py-4 text-center text-sm">
											<div className="flex items-center justify-center">
												<ValueCell value={row.storify} isStorify={true} />
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</motion.div>
			</Container>
		</Section>
	)
}
