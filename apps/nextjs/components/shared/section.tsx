"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type SectionProps = {
	children: React.ReactNode
	className?: string
	id?: string
	variant?: "default" | "dots" | "lines" | "mesh"
}

export function Section({ children, className, id, variant = "default" }: SectionProps) {
	return (
		<motion.section
			id={id}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className={cn("relative overflow-hidden py-16 sm:py-24", className)}
		>
			{/* Dot pattern */}
			{variant === "dots" && (
				<div className="-z-10 pointer-events-none absolute inset-0">
					<div
						className="absolute inset-0 opacity-[0.4]"
						style={{
							backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-brand-purple) 1px, transparent 0)",
							backgroundSize: "32px 32px",
						}}
					/>
					{/* Corner accent */}
					<div className="absolute top-0 right-0 h-px w-32 bg-gradient-to-l from-brand-cyan to-transparent" />
					<div className="absolute top-0 right-0 h-32 w-px bg-gradient-to-b from-brand-cyan to-transparent" />
					<div className="absolute bottom-0 left-0 h-px w-32 bg-gradient-to-r from-brand-pink to-transparent" />
					<div className="absolute bottom-0 left-0 h-32 w-px bg-gradient-to-t from-brand-pink to-transparent" />
				</div>
			)}

			{/* Diagonal lines */}
			{variant === "lines" && (
				<div className="-z-10 pointer-events-none absolute inset-0">
					<svg
						className="absolute inset-0 h-full w-full opacity-[0.06]"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<defs>
							<pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="40" height="40">
								<path d="M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20" stroke="currentColor" strokeWidth="1" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#diagonalLines)" />
					</svg>
					{/* Gradient line accents */}
					<div className="absolute top-1/4 left-0 h-px w-full bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />
					<div className="absolute bottom-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />
				</div>
			)}

			{/* Tech mesh pattern */}
			{variant === "mesh" && (
				<div className="-z-10 pointer-events-none absolute inset-0">
					{/* Grid */}
					<div
						className="absolute inset-0 opacity-[0.03]"
						style={{
							backgroundImage: `
								linear-gradient(to right, currentColor 1px, transparent 1px),
								linear-gradient(to bottom, currentColor 1px, transparent 1px)
							`,
							backgroundSize: "80px 80px",
						}}
					/>
					{/* Corner accent nodes */}
					<div className="absolute top-[12%] right-[10%] size-1.5 rounded-full bg-brand-cyan shadow-[0_0_12px_4px] shadow-brand-cyan/30" />
					<div className="absolute bottom-[15%] left-[8%] size-1.5 rounded-full bg-brand-purple shadow-[0_0_12px_4px] shadow-brand-purple/30" />
					<div className="absolute right-[15%] bottom-[12%] size-1.5 rounded-full bg-brand-pink shadow-[0_0_12px_4px] shadow-brand-pink/30" />
					{/* Connecting line */}
					<svg
						className="absolute inset-0 h-full w-full opacity-20"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<defs>
							<linearGradient id="meshLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stopColor="var(--color-brand-cyan)" />
								<stop offset="50%" stopColor="var(--color-brand-purple)" />
								<stop offset="100%" stopColor="var(--color-brand-pink)" />
							</linearGradient>
						</defs>
						<line x1="90%" y1="12%" x2="8%" y2="85%" stroke="url(#meshLineGradient)" strokeWidth="1" />
						<line x1="8%" y1="85%" x2="85%" y2="88%" stroke="url(#meshLineGradient)" strokeWidth="1" />
					</svg>
				</div>
			)}

			{children}
		</motion.section>
	)
}
