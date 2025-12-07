"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { z } from "zod"
import { isStory } from "../story"
import { isMatrixStory } from "../story-matrix"
import type { MatrixStory, Story } from "../types"
import styles from "./story-tabs.module.css"
import { Tooltip } from "./tooltip"

type StoryExport = {
	name: string
	story: Story<z.ZodType | undefined> | MatrixStory<z.ZodObject<z.ZodRawShape>>
	type: "simple" | "controlled" | "matrix"
}

type StoryTabsProps = {
	exports: StoryExport[]
	activeStory: string
	basePath: string
	filePath: string
}

export function StoryTabs({ exports, activeStory, basePath, filePath }: StoryTabsProps) {
	const router = useRouter()
	const tabsRef = useRef<HTMLDivElement>(null)
	const [showLeftFade, setShowLeftFade] = useState(false)
	const [showRightFade, setShowRightFade] = useState(false)

	// Find current index and compute prev/next
	const currentIndex = useMemo(
		() => exports.findIndex((exp) => exp.name.toLowerCase() === activeStory.toLowerCase()),
		[exports, activeStory],
	)
	const hasPrev = currentIndex > 0
	const hasNext = currentIndex < exports.length - 1

	const getHref = useCallback((name: string) => `${basePath}/${filePath}/${name}`.toLowerCase(), [basePath, filePath])

	const goToPrev = useCallback(() => {
		const prevExport = exports[currentIndex - 1]
		if (hasPrev && prevExport) {
			router.push(getHref(prevExport.name))
		}
	}, [hasPrev, router, getHref, exports, currentIndex])

	const goToNext = useCallback(() => {
		const nextExport = exports[currentIndex + 1]
		if (hasNext && nextExport) {
			router.push(getHref(nextExport.name))
		}
	}, [hasNext, router, getHref, exports, currentIndex])

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Don't trigger if focus is in an input/textarea
			const target = e.target as HTMLElement
			if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
				return
			}

			if (e.key === "ArrowLeft") {
				e.preventDefault()
				goToPrev()
			} else if (e.key === "ArrowRight") {
				e.preventDefault()
				goToNext()
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [goToPrev, goToNext])

	// Check for overflow and update fade indicators
	useEffect(() => {
		const tabs = tabsRef.current
		if (!tabs) return

		const checkOverflow = () => {
			const hasOverflow = tabs.scrollWidth > tabs.clientWidth
			setShowLeftFade(hasOverflow && tabs.scrollLeft > 0)
			setShowRightFade(hasOverflow && tabs.scrollLeft < tabs.scrollWidth - tabs.clientWidth - 1)
		}

		checkOverflow()
		tabs.addEventListener("scroll", checkOverflow)
		window.addEventListener("resize", checkOverflow)

		return () => {
			tabs.removeEventListener("scroll", checkOverflow)
			window.removeEventListener("resize", checkOverflow)
		}
	}, [])

	// Scroll active tab into view
	useEffect(() => {
		const tabs = tabsRef.current
		if (!tabs) return

		const activeTab = tabs.querySelector(`[data-active="true"]`) as HTMLElement
		if (activeTab) {
			activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
		}
	}, [])

	return (
		<div className={styles.container}>
			{/* Navigation buttons */}
			<div className={styles.navButtons}>
				<Tooltip content="Previous variant (←)">
					<button
						type="button"
						onClick={goToPrev}
						disabled={!hasPrev}
						className={styles.navButton}
						aria-label="Previous variant"
					>
						<ChevronLeftIcon />
					</button>
				</Tooltip>
				<Tooltip content="Next variant (→)">
					<button
						type="button"
						onClick={goToNext}
						disabled={!hasNext}
						className={styles.navButton}
						aria-label="Next variant"
					>
						<ChevronRightIcon />
					</button>
				</Tooltip>
			</div>

			{/* Tabs area */}
			<div className={styles.tabsWrapper}>
				{showLeftFade && <div className={styles.fadeLeft} />}
				<div ref={tabsRef} className={styles.tabs}>
					{exports.map((exp) => {
						const isActive = exp.name.toLowerCase() === activeStory.toLowerCase()
						const href = getHref(exp.name)

						return (
							<Link
								key={exp.name}
								href={href}
								className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
								data-active={isActive}
							>
								<span className={styles.tabName}>{exp.name}</span>
								{exp.type === "controlled" && (
									<Tooltip content="Interactive controls">
										<span className={styles.badge}>
											<SlidersIcon />
										</span>
									</Tooltip>
								)}
								{exp.type === "matrix" && (
									<Tooltip content="Matrix view">
										<span className={styles.badge}>
											<GridIcon />
										</span>
									</Tooltip>
								)}
							</Link>
						)
					})}
				</div>
				{showRightFade && <div className={styles.fadeRight} />}
			</div>
		</div>
	)
}

/**
 * Extract story exports from a loaded module.
 * Sorts by: Matrix first, then Controlled, then Simple.
 * Within each group, alphabetically sorted.
 */
export function extractStoryExports(module: Record<string, unknown>): StoryExport[] {
	const exports: StoryExport[] = []

	for (const [name, value] of Object.entries(module)) {
		if (isStory(value)) {
			let type: StoryExport["type"] = "simple"

			if (isMatrixStory(value)) {
				type = "matrix"
			} else if (value.schema) {
				type = "controlled"
			}

			exports.push({ name, story: value, type })
		}
	}

	// Sort: Matrix first, then Controlled, then Simple
	// Within each group, alphabetically by name
	const typeOrder: Record<StoryExport["type"], number> = {
		matrix: 0,
		controlled: 1,
		simple: 2,
	}

	exports.sort((a, b) => {
		const typeCompare = typeOrder[a.type] - typeOrder[b.type]
		if (typeCompare !== 0) return typeCompare
		return a.name.localeCompare(b.name)
	})

	return exports
}

function ChevronLeftIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
			<path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function ChevronRightIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
			<path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function SlidersIcon() {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
			{/* Top slider with circle handle - cyan/purple like Matrix */}
			<path d="M1 3.5H4.5M7.5 3.5H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<circle cx="6" cy="3.5" r="2" fill="url(#sliderGrad1)" />
			{/* Bottom slider with circle handle - amber/pink like Matrix */}
			<path d="M1 8.5H4.5M7.5 8.5H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<circle cx="6" cy="8.5" r="2" fill="url(#sliderGrad2)" />
			<defs>
				<linearGradient id="sliderGrad1" x1="4" y1="3.5" x2="8" y2="3.5" gradientUnits="userSpaceOnUse">
					<stop stopColor="#06B6D4" />
					<stop offset="1" stopColor="#8B5CF6" />
				</linearGradient>
				<linearGradient id="sliderGrad2" x1="4" y1="8.5" x2="8" y2="8.5" gradientUnits="userSpaceOnUse">
					<stop stopColor="#F59E0B" />
					<stop offset="1" stopColor="#EC4899" />
				</linearGradient>
			</defs>
		</svg>
	)
}

function GridIcon() {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
			{/* 4 colored squares - inspired by variation/diversity */}
			<rect x="1.5" y="1.5" width="3.5" height="3.5" rx="0.75" fill="#06B6D4" />
			<rect x="7" y="1.5" width="3.5" height="3.5" rx="0.75" fill="#8B5CF6" />
			<rect x="1.5" y="7" width="3.5" height="3.5" rx="0.75" fill="#F59E0B" />
			<rect x="7" y="7" width="3.5" height="3.5" rx="0.75" fill="#EC4899" />
		</svg>
	)
}
