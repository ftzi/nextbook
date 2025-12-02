import { ImageResponse } from "next/og"

export const revalidate = 3600

const ICON_SIZE = {
	width: 32,
	height: 32,
}

export const GET = () =>
	new ImageResponse(
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="32" height="32" aria-hidden="true">
			<defs>
				<linearGradient id="icon_gradient" x1="0%" x2="100%" y1="0%" y2="100%">
					<stop offset="0%" stopColor="#06b6d4" />
					<stop offset="50%" stopColor="#7c3aed" />
					<stop offset="100%" stopColor="#e048b9" />
				</linearGradient>
			</defs>
			<path
				fill="none"
				stroke="url(#icon_gradient)"
				strokeWidth={50}
				d="M115 115h170v170H115z"
				transform="rotate(45 200 200)"
			/>
		</svg>,
		ICON_SIZE,
	)

export const contentType = "image/png"
