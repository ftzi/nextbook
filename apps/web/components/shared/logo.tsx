"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type LogoProps = {
	className?: string
	showText?: boolean
	size?: "sm" | "md" | "lg"
}

const sizes = {
	sm: { icon: 24, text: "text-lg" },
	md: { icon: 32, text: "text-xl" },
	lg: { icon: 48, text: "text-3xl" },
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
	const { icon, text } = sizes[size]

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<motion.svg
				width={icon}
				height={icon}
				viewBox="0 0 400 400"
				initial={{ rotate: 0 }}
				whileHover={{ rotate: 180, scale: 1.1 }}
				transition={{ duration: 0.5, ease: "easeInOut" }}
				className="shrink-0"
				role="img"
				aria-label="Nextbook logo"
			>
				<defs>
					<linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style={{ stopColor: "#06B6D4" }} />
						<stop offset="50%" style={{ stopColor: "#7C3AED" }} />
						<stop offset="100%" style={{ stopColor: "#EC4899" }} />
					</linearGradient>
					<filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="6" result="coloredBlur" />
						<feMerge>
							<feMergeNode in="coloredBlur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<g transform="rotate(45 200 200)">
					<rect
						x="115"
						y="115"
						width="170"
						height="170"
						fill="none"
						stroke="url(#logoGradient)"
						strokeWidth="70"
						filter="url(#logoGlow)"
						opacity="0.9"
					/>
				</g>
			</motion.svg>

			{showText && <span className={cn("gradient-text font-bold tracking-tight", text)}>Nextbook</span>}
		</div>
	)
}

export function LogoIcon({ className, size = 32 }: { className?: string; size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 400 400" className={className} role="img" aria-label="Nextbook logo">
			<defs>
				<linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style={{ stopColor: "#06B6D4" }} />
					<stop offset="50%" style={{ stopColor: "#7C3AED" }} />
					<stop offset="100%" style={{ stopColor: "#EC4899" }} />
				</linearGradient>
			</defs>
			<g transform="rotate(45 200 200)">
				<rect
					x="115"
					y="115"
					width="170"
					height="170"
					fill="none"
					stroke="url(#iconGradient)"
					strokeWidth="70"
					opacity="0.9"
				/>
			</g>
		</svg>
	)
}
