import { ImageResponse } from "next/og"
import { brandColors } from "@/lib/opengraph/defaults"

/**
 * OpenGraph image for social sharing.
 * Test with: https://chromewebstore.google.com/detail/nggoiohoonibebildpjhlaakfoccpfln
 * Inspiration: https://www.opengraph.xyz/inspiration
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

export const alt = "Nextbook - Zero-config component stories for Next.js"

export const size = {
	width: 1200,
	height: 630,
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
					width: "500px",
					height: "500px",
					background: `radial-gradient(circle, ${brandColors.cyan}40 0%, transparent 70%)`,
					borderRadius: "50%",
					filter: "blur(60px)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "-20%",
					right: "-10%",
					width: "500px",
					height: "500px",
					background: `radial-gradient(circle, ${brandColors.pink}40 0%, transparent 70%)`,
					borderRadius: "50%",
					filter: "blur(60px)",
				}}
			/>

			{/* Diamond icon */}
			<div
				style={{
					display: "flex",
					marginBottom: "30px",
				}}
			>
				<svg width="100" height="100" viewBox="0 0 400 400" role="img" aria-label="Nextbook logo">
					<defs>
						<linearGradient id="ogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
							stroke="url(#ogGradient)"
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
					fontSize: "72px",
					fontWeight: "bold",
					background: `linear-gradient(135deg, ${brandColors.cyan} 0%, ${brandColors.purple} 50%, ${brandColors.pink} 100%)`,
					backgroundClip: "text",
					color: "transparent",
					marginBottom: "20px",
				}}
			>
				Nextbook
			</div>

			{/* Tagline */}
			<div
				style={{
					display: "flex",
					fontSize: "28px",
					color: "#a1a1aa",
					maxWidth: "700px",
					textAlign: "center",
					lineHeight: 1.4,
				}}
			>
				Zero-config component stories for Next.js
			</div>
		</div>,
		{
			...size,
		},
	)
}
