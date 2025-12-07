import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

// Static version of Icon for OG image generation (can't use useId hook on server)
function StaticIcon({ width, height }: { width: number; height: number }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width={width} height={height} aria-hidden="true">
			<defs>
				<linearGradient id="icon-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
					<stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
					<stop offset="50%" stopColor="#7c3aed" stopOpacity={1} />
					<stop offset="100%" stopColor="#e048b9" stopOpacity={1} />
				</linearGradient>
			</defs>
			<path
				fill="none"
				stroke="url(#icon-gradient)"
				strokeWidth={50}
				d="M115 115h170v170H115z"
				opacity={0.9}
				transform="rotate(45 200 200)"
			/>
		</svg>
	)
}

export default function IconImage() {
	return new ImageResponse(<StaticIcon width={32} height={32} />, size)
}
