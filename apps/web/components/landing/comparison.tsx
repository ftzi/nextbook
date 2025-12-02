"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { cn } from "@/lib/utils"

type ComparisonRow = {
	feature: string
	storybook: string | boolean
	nextbook: string | boolean
	highlight?: boolean
}

const comparisons: ComparisonRow[] = [
	{ feature: "Setup time", storybook: "~30 min", nextbook: "~5 min" },
	{ feature: "Separate build", storybook: true, nextbook: false },
	{ feature: "Config duplication", storybook: true, nextbook: false },
	{ feature: "Bundle size", storybook: "Large", nextbook: "Minimal" },
	{
		feature: "Hot reload",
		storybook: "Separate process",
		nextbook: "Same as app",
	},
	{
		feature: "Combinatorial testing",
		storybook: "Manual",
		nextbook: "Automatic",
		highlight: true,
	},
	{
		feature: "Variant coverage",
		storybook: "What you remember",
		nextbook: "100% guaranteed",
		highlight: true,
	},
	{
		feature: "Maintenance burden",
		storybook: "High",
		nextbook: "Zero",
		highlight: true,
	},
]

function ValueCell({ value, isNextbook }: { value: string | boolean; isNextbook: boolean }) {
	if (typeof value === "boolean") {
		return value ? (
			<X className={cn("size-5", isNextbook ? "text-red-400" : "text-muted-foreground")} />
		) : (
			<Check className={cn("size-5", isNextbook ? "text-green-400" : "text-muted-foreground")} />
		)
	}

	return <span className={cn(isNextbook && "font-medium text-foreground")}>{value}</span>
}

export function Comparison() {
	return (
		<Section id="comparison">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
						Why <span className="gradient-text">Nextbook</span> over Storybook?
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">Built specifically for Next.js. No compromises.</p>
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
										<span className="gradient-text">Nextbook</span>
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
												<ValueCell value={row.storybook} isNextbook={false} />
											</div>
										</td>
										<td className="px-6 py-4 text-center text-sm">
											<div className="flex items-center justify-center">
												<ValueCell value={row.nextbook} isNextbook={true} />
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
