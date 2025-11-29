"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"
import styles from "./tooltip.module.css"

const TOOLTIP_DELAY_MS = 200

type TooltipProps = {
	content: string
	children: ReactNode
}

type HorizontalAlign = "center" | "left" | "right"

export function Tooltip({ content, children }: TooltipProps) {
	const wrapperRef = useRef<HTMLSpanElement>(null)
	const tooltipRef = useRef<HTMLSpanElement>(null)
	const [visible, setVisible] = useState(false)
	const [position, setPosition] = useState<"top" | "bottom">("top")
	const [align, setAlign] = useState<HorizontalAlign>("center")
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		if (!(visible && wrapperRef.current && tooltipRef.current)) return

		const wrapperRect = wrapperRef.current.getBoundingClientRect()
		const tooltipRect = tooltipRef.current.getBoundingClientRect()

		// Vertical positioning
		const spaceAbove = wrapperRect.top
		const tooltipHeight = tooltipRect.height + 8

		if (spaceAbove < tooltipHeight) {
			setPosition("bottom")
		} else {
			setPosition("top")
		}

		// Horizontal positioning
		const tooltipHalfWidth = tooltipRect.width / 2
		const wrapperCenter = wrapperRect.left + wrapperRect.width / 2
		const viewportWidth = window.innerWidth

		if (wrapperCenter - tooltipHalfWidth < 8) {
			setAlign("left")
		} else if (wrapperCenter + tooltipHalfWidth > viewportWidth - 8) {
			setAlign("right")
		} else {
			setAlign("center")
		}
	}, [visible])

	const handleMouseEnter = () => {
		timeoutRef.current = setTimeout(() => {
			setVisible(true)
		}, TOOLTIP_DELAY_MS)
	}

	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
		setVisible(false)
	}

	useEffect(
		() => () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		},
		[],
	)

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: tooltip wrapper needs mouse events
		<span ref={wrapperRef} className={styles.wrapper} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			{children}
			{visible && (
				<span
					ref={tooltipRef}
					className={`${styles.tooltip} ${position === "bottom" ? styles.tooltipBottom : styles.tooltipTop} ${styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`]}`}
					role="tooltip"
				>
					{content}
				</span>
			)}
		</span>
	)
}
