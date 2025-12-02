"use client"

import { useId, type SVGProps } from "react";
const SvgIcon = (props: SVGProps<SVGSVGElement>) => {
	const id = useId();
	const id0 = `${id}-icon_svg__a`;
	const id1 = `${id}-icon_svg__b`;

	return (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 400"
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id={id0} x1="0%" x2="100%" y1="0%" y2="100%">
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
            stopColor: "#e048b9",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <filter id={id1} width="200%" height="200%" x="-50%" y="-50%">
        <feGaussianBlur result="coloredBlur" stdDeviation={6} />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      fill="none"
      stroke={`url(#${id0})`}
      strokeWidth={50}
      d="M115 115h170v170H115z"
      filter={`url(#${id1})`}
      opacity={0.9}
      transform="rotate(45 200 200)"
    />
  </svg>
);
};
export default SvgIcon;
