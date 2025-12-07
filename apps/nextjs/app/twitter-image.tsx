import { ImageResponse } from "next/og"
import { brandColors } from "@/lib/opengraph/defaults"

/**
 * Twitter card image (summary_large_image).
 * Slightly different dimensions optimized for Twitter display.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#twitter-image
 */

export const alt = "Storify - Zero-config component stories for React frameworks"

export const size = {
	width: 1200,
	height: 600,
}

export const contentType = "image/png"

export default function Image() {
	return new ImageResponse(
		<div
			style={{
				background: `linear-gradient(135deg, ${brandColors.dark} 0%, #1a1a2e 100%)`,
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: "system-ui, sans-serif",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Gradient blur effects */}
			<div
				style={{
					position: "absolute",
					top: "-20%",
					left: "-10%",
					width: "400px",
					height: "400px",
					background: `radial-gradient(circle, ${brandColors.cyan}40 0%, transparent 70%)`,
					borderRadius: "50%",
					filter: "blur(50px)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "-20%",
					right: "-10%",
					width: "400px",
					height: "400px",
					background: `radial-gradient(circle, ${brandColors.pink}40 0%, transparent 70%)`,
					borderRadius: "50%",
					filter: "blur(50px)",
				}}
			/>

			{/* Diamond icon */}
			<div
				style={{
					display: "flex",
					marginBottom: "24px",
				}}
			>
				<svg width="80" height="80" viewBox="0 0 400 400" role="img" aria-label="Storify logo">
					<defs>
						<linearGradient id="twitterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" style={{ stopColor: brandColors.cyan }} />
							<stop offset="50%" style={{ stopColor: brandColors.purple }} />
							<stop offset="100%" style={{ stopColor: brandColors.pink }} />
						</linearGradient>
					</defs>
					<g transform="rotate(45 200 200)">
						<rect
							x="115"
							y="115"
							width="170"
							height="170"
							fill="none"
							stroke="url(#twitterGradient)"
							strokeWidth="70"
							opacity="0.9"
						/>
					</g>
				</svg>
			</div>

			{/* Title with gradient */}
			<div
				style={{
					display: "flex",
					fontSize: "64px",
					fontWeight: "bold",
					background: `linear-gradient(135deg, ${brandColors.cyan} 0%, ${brandColors.purple} 50%, ${brandColors.pink} 100%)`,
					backgroundClip: "text",
					color: "transparent",
					marginBottom: "16px",
				}}
			>
				Storify
			</div>

			{/* Tagline */}
			<div
				style={{
					display: "flex",
					fontSize: "24px",
					color: "#a1a1aa",
					maxWidth: "600px",
					textAlign: "center",
				}}
			>
				Zero-config component stories for React frameworks
			</div>
		</div>,
		{
			...size,
		},
	)
}
