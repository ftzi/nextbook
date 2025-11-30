import type { SVGProps } from "react"

const SvgIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" aria-hidden="true" {...props}>
		<defs>
			<linearGradient id="icon_svg__a" x1="0%" x2="100%" y1="0%" y2="100%">
				<stop
					offset="0%"
					style={{
						stopColor: "#06b6d4",
						stopOpacity: 1,
					}}
				/>
				<stop
					offset="50%"
					style={{
						stopColor: "#7c3aed",
						stopOpacity: 1,
					}}
				/>
				<stop
					offset="100%"
					style={{
						stopColor: "#ec4899",
						stopOpacity: 1,
					}}
				/>
			</linearGradient>
			<filter id="icon_svg__b" width="200%" height="200%" x="-50%" y="-50%">
				<feGaussianBlur result="coloredBlur" stdDeviation={6} />
				<feMerge>
					<feMergeNode in="coloredBlur" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>
		<path
			fill="none"
			stroke="url(#icon_svg__a)"
			strokeWidth={70}
			d="M115 115h170v170H115z"
			filter="url(#icon_svg__b)"
			opacity={0.9}
			transform="rotate(45 200 200)"
		/>
	</svg>
)
export default SvgIcon
