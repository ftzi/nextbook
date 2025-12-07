"use client"

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import styles from "./tooltip.module.css"

const TOOLTIP_DELAY_MS = 200
const TOOLTIP_OFFSET = 8

type TooltipProps = {
	content: string
	children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
	const wrapperRef = useRef<HTMLSpanElement>(null)
	const tooltipRef = useRef<HTMLDivElement>(null)
	const [visible, setVisible] = useState(false)
	const [coords, setCoords] = useState({ top: 0, left: 0 })
	const [position, setPosition] = useState<"top" | "bottom">("top")
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [mounted, setMounted] = useState(false)

	// Only render portal on client
	useEffect(() => {
		setMounted(true)
	}, [])

	// Calculate position when visible
	useLayoutEffect(() => {
		if (!(visible && wrapperRef.current && tooltipRef.current)) return

		const wrapperRect = wrapperRef.current.getBoundingClientRect()
		const tooltipRect = tooltipRef.current.getBoundingClientRect()

		// Vertical positioning - prefer top, fallback to bottom
		const spaceAbove = wrapperRect.top
		const tooltipHeight = tooltipRect.height + TOOLTIP_OFFSET
		const showBelow = spaceAbove < tooltipHeight

		// Calculate top position
		let top: number
		if (showBelow) {
			top = wrapperRect.bottom + TOOLTIP_OFFSET
			setPosition("bottom")
		} else {
			top = wrapperRect.top - tooltipRect.height - TOOLTIP_OFFSET
			setPosition("top")
		}

		// Horizontal positioning - center on wrapper, but keep within viewport
		const viewportWidth = window.innerWidth
		let left = wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2

		// Clamp to viewport with padding
		const padding = 8
		if (left < padding) {
			left = padding
		} else if (left + tooltipRect.width > viewportWidth - padding) {
			left = viewportWidth - tooltipRect.width - padding
		}

		setCoords({ top, left })
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
			{mounted &&
				visible &&
				createPortal(
					<div
						ref={tooltipRef}
						className={`${styles.tooltip} ${position === "bottom" ? styles.tooltipBottom : styles.tooltipTop}`}
						style={{ top: coords.top, left: coords.left }}
						role="tooltip"
					>
						{content}
					</div>,
					document.body,
				)}
		</span>
	)
}
