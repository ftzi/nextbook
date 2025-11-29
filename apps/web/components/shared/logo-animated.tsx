"use client"

import type { SVGProps } from "react"

export function LogoAnimated(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 3000 520" aria-hidden="true" {...props}>
			<defs>
				<filter id="logo-animated_svg__b" width="200%" height="200%" x="-50%" y="-50%">
					<feGaussianBlur result="coloredBlur" stdDeviation={6} />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<filter id="logo-animated_svg__c" width="200%" height="200%" x="-50%" y="-50%">
					<feGaussianBlur result="coloredBlur" stdDeviation={3} />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<filter id="logo-animated_svg__e" width="200%" height="200%" x="-50%" y="-50%">
					<feTurbulence baseFrequency="0.006 0.04" numOctaves={2} result="turbulence" seed={5}>
						<animate
							attributeName="baseFrequency"
							dur="12s"
							repeatCount="indefinite"
							values="0.006 0.04;0.008 0.05;0.006 0.04"
						/>
					</feTurbulence>
					<feDisplacementMap
						in="SourceGraphic"
						in2="turbulence"
						result="displaced"
						scale={4}
						xChannelSelector="R"
						yChannelSelector="G"
					>
						<animate attributeName="scale" dur="10s" repeatCount="indefinite" values="2;5;2" />
					</feDisplacementMap>
					<feGaussianBlur in="displaced" result="coloredBlur" stdDeviation={3} />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="displaced" />
					</feMerge>
				</filter>
				<filter id="logo-animated_svg__g" width="200%" height="200%" x="-50%" y="-50%">
					<feTurbulence baseFrequency="0.006 0.04" numOctaves={2} result="turbulence" seed={7}>
						<animate
							attributeName="baseFrequency"
							dur="12s"
							repeatCount="indefinite"
							values="0.006 0.04;0.008 0.05;0.006 0.04"
						/>
					</feTurbulence>
					<feDisplacementMap
						in="SourceGraphic"
						in2="turbulence"
						result="displaced"
						scale={7}
						xChannelSelector="R"
						yChannelSelector="G"
					>
						<animate attributeName="scale" dur="10s" repeatCount="indefinite" values="4;9;4" />
					</feDisplacementMap>
					<feGaussianBlur in="displaced" result="coloredBlur" stdDeviation={3} />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="displaced" />
					</feMerge>
				</filter>
				<filter id="logo-animated_svg__h" width="200%" height="200%" x="-50%" y="-50%">
					<feTurbulence baseFrequency="0.006 0.04" numOctaves={2} result="turbulence" seed={11}>
						<animate
							attributeName="baseFrequency"
							dur="12s"
							repeatCount="indefinite"
							values="0.006 0.04;0.008 0.05;0.006 0.04"
						/>
					</feTurbulence>
					<feDisplacementMap
						in="SourceGraphic"
						in2="turbulence"
						result="displaced"
						scale={10}
						xChannelSelector="R"
						yChannelSelector="G"
					>
						<animate attributeName="scale" dur="10s" repeatCount="indefinite" values="7;13;7" />
					</feDisplacementMap>
					<feGaussianBlur in="displaced" result="coloredBlur" stdDeviation={3} />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="displaced" />
					</feMerge>
				</filter>
				<filter id="logo-animated_svg__i" width="200%" height="200%" x="-50%" y="-50%">
					<feTurbulence baseFrequency="0.006 0.04" numOctaves={2} result="turbulence" seed={13}>
						<animate
							attributeName="baseFrequency"
							dur="12s"
							repeatCount="indefinite"
							values="0.006 0.04;0.008 0.05;0.006 0.04"
						/>
					</feTurbulence>
					<feDisplacementMap
						in="SourceGraphic"
						in2="turbulence"
						result="displaced"
						scale={13}
						xChannelSelector="R"
						yChannelSelector="G"
					>
						<animate attributeName="scale" dur="10s" repeatCount="indefinite" values="10;16;10" />
					</feDisplacementMap>
					<feGaussianBlur in="displaced" result="coloredBlur" stdDeviation={3} />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="displaced" />
					</feMerge>
				</filter>
				<linearGradient id="logo-animated_svg__a" x1="0%" x2="100%" y1="0%" y2="100%">
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
				<linearGradient id="logo-animated_svg__d" x1={420} x2={1580} y1={0} y2={0} gradientUnits="userSpaceOnUse">
					<stop
						offset="0%"
						style={{
							stopColor: "#06b6d4",
							stopOpacity: 1,
						}}
					/>
					<stop
						offset="100%"
						style={{
							stopColor: "#4f46e5",
							stopOpacity: 1,
						}}
					/>
				</linearGradient>
				<linearGradient id="logo-animated_svg__f" x1={0} x2={1220} y1={0} y2={0} gradientUnits="userSpaceOnUse">
					<stop
						offset="0%"
						style={{
							stopColor: "#4f46e5",
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
			</defs>
			<path
				fill="none"
				stroke="url(#logo-animated_svg__a)"
				strokeWidth={70}
				d="M115 115h170v170H115z"
				filter="url(#logo-animated_svg__b)"
				opacity={0.9}
				transform="rotate(45 225 260.355)"
			/>
			<text
				x={420}
				y={245}
				dominantBaseline="middle"
				filter="url(#logo-animated_svg__c)"
				fontFamily="'Helvetica Neue'"
				fontSize={550}
				fontWeight={700}
				letterSpacing={-16}
				opacity={0.9}
			>
				<tspan fill="url(#logo-animated_svg__d)" stroke="url(#logo-animated_svg__d)" strokeWidth={11}>
					Next
				</tspan>
			</text>
			<g
				fill="none"
				stroke="url(#logo-animated_svg__f)"
				strokeWidth={11}
				dominantBaseline="middle"
				fontFamily="'Helvetica Neue'"
				fontSize={550}
				fontWeight={700}
				letterSpacing={-16}
				transform="translate(1580)"
			>
				<text y={245} filter="url(#logo-animated_svg__e)" opacity={0.9}>
					b
				</text>
				<text x={300} y={245} filter="url(#logo-animated_svg__g)" opacity={0.9}>
					o
				</text>
				<text x={600} y={245} filter="url(#logo-animated_svg__h)" opacity={0.9}>
					o
				</text>
				<text x={900} y={245} filter="url(#logo-animated_svg__i)" opacity={0.9}>
					k
				</text>
			</g>
		</svg>
	)
}
