"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type SectionProps = {
	children: React.ReactNode
	className?: string
	id?: string
	background?: "default" | "muted" | "gradient"
}

export function Section({ children, className, id, background = "default" }: SectionProps) {
	return (
		<motion.section
			id={id}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className={cn(
				"py-16 sm:py-24",
				background === "muted" && "bg-muted/50",
				background === "gradient" && "bg-gradient-to-b from-transparent via-muted/30 to-transparent",
				className,
			)}
		>
			{children}
		</motion.section>
	)
}
