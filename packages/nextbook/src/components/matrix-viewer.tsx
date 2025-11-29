"use client"

import { useCallback, useEffect, useState } from "react"
import type { z } from "zod"
import type { MatrixStory, PropCombination } from "../types"
import { generateCombinations } from "../utils/schema"
import styles from "./matrix-viewer.module.css"
import { Tooltip } from "./tooltip"

type BackgroundType = "default" | "striped" | "checkered"

const CELL_CONTENT_CLASSES: Record<BackgroundType, string | undefined> = {
	default: styles.cellContentDefault,
	striped: styles.cellContentStriped,
	checkered: styles.cellContentCheckered,
}

const CANVAS_CLASSES: Record<BackgroundType, string | undefined> = {
	default: styles.canvasDefault,
	striped: styles.canvasStriped,
	checkered: styles.canvasCheckered,
}

type MatrixViewerProps = {
	story: MatrixStory<z.ZodObject<z.ZodRawShape>>
	title: string
}

export function MatrixViewer({ story, title }: MatrixViewerProps) {
	const [combinations, setCombinations] = useState<PropCombination[]>([])
	const [total, setTotal] = useState(0)
	const [truncated, setTruncated] = useState(false)
	const [background, setBackground] = useState<BackgroundType>("default")
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

	// Generate combinations from schema
	useEffect(() => {
		const result = generateCombinations(story.schema)
		setCombinations(result.combinations)
		setTotal(result.total)
		setTruncated(result.truncated)
	}, [story.schema])

	const handleCellClick = useCallback((index: number) => {
		setSelectedIndex((prev) => (prev === index ? null : index))
	}, [])

	const handleBackToGrid = useCallback(() => {
		setSelectedIndex(null)
	}, [])

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && selectedIndex !== null) {
				setSelectedIndex(null)
			}
		}
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [selectedIndex])

	const renderStory = (values: Record<string, unknown>) => {
		try {
			return story.render(values as z.output<z.ZodObject<z.ZodRawShape>>)
		} catch (err) {
			console.error("[nextbook] Error rendering matrix cell:", err)
			return (
				<div className={styles.cellError}>
					<span>Error</span>
				</div>
			)
		}
	}

	// Selected cell view (expanded)
	if (selectedIndex !== null) {
		const selected = combinations[selectedIndex]
		if (!selected) {
			setSelectedIndex(null)
			return null
		}
		return (
			<div className={styles.container}>
				<header className={styles.header}>
					<div className={styles.headerLeft}>
						<button type="button" onClick={handleBackToGrid} className={styles.backButton}>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
								<path
									d="M10 12L6 8L10 4"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							Back to matrix
						</button>
						<span className={styles.divider} />
						<h1 className={styles.title}>{title}</h1>
					</div>
					<div className={styles.headerControls}>
						<BackgroundSwitcher value={background} onChange={setBackground} />
					</div>
				</header>
				<div className={styles.selectedView}>
					<div className={styles.selectedLabel}>{selected.label}</div>
					<div className={`${styles.selectedCanvas} ${CANVAS_CLASSES[background] ?? ""}`}>
						<div className={styles.selectedFrame}>{renderStory(selected.values)}</div>
					</div>
				</div>
			</div>
		)
	}

	// Grid view
	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.headerLeft}>
					<h1 className={styles.title}>{title}</h1>
					<span className={styles.badge}>{truncated ? `${combinations.length} of ${total}` : total} combinations</span>
				</div>
				<div className={styles.headerControls}>
					<BackgroundSwitcher value={background} onChange={setBackground} />
				</div>
			</header>

			{truncated && (
				<div className={styles.warning}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path
							d="M8 5.5V8.5M8 10.5H8.005M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span>
						Showing {combinations.length} of {total} total combinations. Add more specific props to reduce the matrix
						size.
					</span>
				</div>
			)}

			<div className={styles.grid}>
				{combinations.map((combo, index) => (
					<button
						key={combo.label}
						type="button"
						className={styles.cell}
						onClick={() => handleCellClick(index)}
						aria-label={`View ${combo.label}`}
					>
						<div className={styles.cellLabel}>{combo.label}</div>
						<div className={`${styles.cellContent} ${CELL_CONTENT_CLASSES[background] ?? ""}`}>
							{renderStory(combo.values)}
						</div>
					</button>
				))}
			</div>
		</div>
	)
}

function BackgroundSwitcher({ value, onChange }: { value: BackgroundType; onChange: (value: BackgroundType) => void }) {
	return (
		<div className={styles.backgroundSwitcher}>
			<Tooltip content="Default background">
				<button
					type="button"
					onClick={() => onChange("default")}
					className={`${styles.bgButton} ${value === "default" ? styles.bgButtonActive : ""}`}
				>
					<span className={`${styles.bgButtonInner} ${styles.bgDefault}`} />
				</button>
			</Tooltip>
			<Tooltip content="Striped background">
				<button
					type="button"
					onClick={() => onChange("striped")}
					className={`${styles.bgButton} ${value === "striped" ? styles.bgButtonActive : ""}`}
				>
					<span className={`${styles.bgButtonInner} ${styles.bgStriped}`} />
				</button>
			</Tooltip>
			<Tooltip content="Checkered background">
				<button
					type="button"
					onClick={() => onChange("checkered")}
					className={`${styles.bgButton} ${value === "checkered" ? styles.bgButtonActive : ""}`}
				>
					<span className={`${styles.bgButtonInner} ${styles.bgCheckered}`} />
				</button>
			</Tooltip>
		</div>
	)
}
