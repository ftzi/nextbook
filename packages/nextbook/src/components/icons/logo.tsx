"use client"

import { useId, type SVGProps } from "react";
const SvgLogo = (props: SVGProps<SVGSVGElement>) => {
	const id = useId();
	const id0 = `${id}-logo_svg__a`;
	const id1 = `${id}-logo_svg__d`;
	const id2 = `${id}-logo_svg__e`;
	const id3 = `${id}-logo_svg__b`;
	const id4 = `${id}-logo_svg__c`;

	return (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-60 -60 2720 520"
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
          offset="70%"
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
      <linearGradient
        id={id1}
        x1={420}
        x2={1580}
        y1={0}
        y2={0}
        gradientUnits="userSpaceOnUse"
      >
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
            stopColor: "#4169e1",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <linearGradient
        id={id2}
        x1={0}
        x2={1220}
        y1={0}
        y2={0}
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset="0%"
          style={{
            stopColor: "#4169e1",
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
      <filter id={id3} width="200%" height="200%" x="-50%" y="-50%">
        <feGaussianBlur result="coloredBlur" stdDeviation={6} />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={id4} width="200%" height="200%" x="-50%" y="-50%">
        <feGaussianBlur result="coloredBlur" stdDeviation={3} />
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
      d="M0 0h130v130H0z"
      filter={`url(#${id3})`}
      opacity={0.9}
      transform="rotate(45 -77.96 152.5)"
    />
    <text
      y={245}
      dominantBaseline="middle"
      filter={`url(#${id4})`}
      fontFamily="'Helvetica Neue'"
      fontSize={550}
      fontWeight={700}
      letterSpacing={-16}
      opacity={0.9}
      transform="translate(210)"
    >
      <tspan
        fill={`url(#${id1})`}
        stroke={`url(#${id1})`}
        strokeWidth={11}
      >
        {"Next"}
      </tspan>
    </text>
    <text
      y={245}
      fill="none"
      stroke={`url(#${id2})`}
      strokeWidth={22}
      dominantBaseline="middle"
      filter="url(#logo_svg__mirageB)"
      fontFamily="'Helvetica Neue'"
      fontSize={550}
      fontWeight={700}
      letterSpacing={-16}
      opacity={0.9}
      transform="translate(1380)"
    >
      {"book"}
    </text>
  </svg>
);
};
export default SvgLogo;
