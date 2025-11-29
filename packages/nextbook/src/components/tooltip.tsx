"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"
import styles from "./tooltip.module.css"

type TooltipProps = {
	content: string
	children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
	const wrapperRef = useRef<HTMLSpanElement>(null)
	const tooltipRef = useRef<HTMLSpanElement>(null)
	const [visible, setVisible] = useState(false)
	const [position, setPosition] = useState<"top" | "bottom">("top")

	useEffect(() => {
		if (!(visible && wrapperRef.current && tooltipRef.current)) return

		const wrapperRect = wrapperRef.current.getBoundingClientRect()
		const tooltipRect = tooltipRef.current.getBoundingClientRect()

		const spaceAbove = wrapperRect.top
		const tooltipHeight = tooltipRect.height + 8

		if (spaceAbove < tooltipHeight) {
			setPosition("bottom")
		} else {
			setPosition("top")
		}
	}, [visible])

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: tooltip wrapper needs mouse events
		<span
			ref={wrapperRef}
			className={styles.wrapper}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
		>
			{children}
			{visible && (
				<span
					ref={tooltipRef}
					className={`${styles.tooltip} ${position === "bottom" ? styles.tooltipBottom : styles.tooltipTop}`}
					role="tooltip"
				>
					{content}
				</span>
			)}
		</span>
	)
}
