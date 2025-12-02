"use client"

import { useVirtualizer } from "@tanstack/react-virtual"
import { ArrowDownUp, ChevronDown, Filter, RotateCcw, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { z } from "zod"
import type { MatrixStory, PropCombination } from "../types"
import { type DimensionInfo, generateCombinations } from "../utils/schema"
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

// Default cell dimensions
const DEFAULT_CELL_WIDTH = 220
const DEFAULT_CELL_HEIGHT = 140
const CELL_GAP = 16

type MatrixViewerProps = {
	story: MatrixStory<z.ZodObject<z.ZodRawShape>>
	title: string
}

// Multi-priority sort: array of {field, direction} in priority order
type SortItem = {
	field: string
	direction: "asc" | "desc"
}

// Filter state: dimension name -> set of selected values (empty = all selected)
type FilterState = Record<string, Set<unknown>>

type CompareParams = {
	aVal: unknown
	bVal: unknown
	direction: "asc" | "desc"
}

/**
 * Compare two values for sorting. Returns negative, zero, or positive.
 */
function compareValues({ aVal, bVal, direction }: CompareParams): number {
	const multiplier = direction === "asc" ? 1 : -1

	if (typeof aVal === "string" && typeof bVal === "string") {
		return multiplier * aVal.localeCompare(bVal)
	}
	if (typeof aVal === "number" && typeof bVal === "number") {
		return multiplier * (aVal - bVal)
	}
	if (typeof aVal === "boolean" && typeof bVal === "boolean") {
		const aNum = aVal ? 1 : 0
		const bNum = bVal ? 1 : 0
		return multiplier * (aNum - bNum)
	}

	// Fallback: convert to string
	const aStr = String(aVal)
	const bStr = String(bVal)
	return multiplier * aStr.localeCompare(bStr)
}

type MultiFieldCompareParams = {
	a: PropCombination
	b: PropCombination
	sortItems: SortItem[]
}

/**
 * Multi-field comparator for sorting combinations.
 */
function multiFieldCompare({ a, b, sortItems }: MultiFieldCompareParams): number {
	for (const item of sortItems) {
		const result = compareValues({
			aVal: a.values[item.field],
			bVal: b.values[item.field],
			direction: item.direction,
		})
		if (result !== 0) return result
	}
	return 0
}

export function MatrixViewer({ story, title }: MatrixViewerProps) {
	const searchParams = useSearchParams()
	const fullRender = searchParams.get("fullRender") === "true"

	const [allCombinations, setAllCombinations] = useState<PropCombination[]>([])
	const [dimensions, setDimensions] = useState<DimensionInfo[]>([])
	const [total, setTotal] = useState(0)
	const [truncated, setTruncated] = useState(false)
	const [background, setBackground] = useState<BackgroundType>("default")
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

	// Filter and sort state
	const [filters, setFilters] = useState<FilterState>({})
	const [sortItems, setSortItems] = useState<SortItem[]>([])

	// Cell dimensions - start with defaults, will be measured from first rendered cell
	const [cellDimensions, setCellDimensions] = useState({ width: DEFAULT_CELL_WIDTH, height: DEFAULT_CELL_HEIGHT })
	const hasMeasuredRef = useRef(false)

	// Container ref for virtualization - using callback ref to set up ResizeObserver
	const containerRef = useRef<HTMLDivElement>(null)
	const observerRef = useRef<ResizeObserver | null>(null)
	// Initialize with a reasonable default to avoid single-column flash
	const [containerWidth, setContainerWidth] = useState(800)

	// Callback ref to set up ResizeObserver when container mounts
	const containerCallbackRef = useCallback((node: HTMLDivElement | null) => {
		// Clean up previous observer
		if (observerRef.current) {
			observerRef.current.disconnect()
			observerRef.current = null
		}

		// Update the ref
		containerRef.current = node

		if (node) {
			const observer = new ResizeObserver((entries) => {
				const entry = entries[0]
				if (entry) {
					setContainerWidth(entry.contentRect.width)
				}
			})
			observer.observe(node)
			observerRef.current = observer
		}
	}, [])

	// Generate combinations from schema
	useEffect(() => {
		const result = generateCombinations(story.schema)
		setAllCombinations(result.combinations)
		setDimensions(result.dimensions)
		setTotal(result.total)
		setTruncated(result.truncated)
	}, [story.schema])

	// Apply filters and sorting to combinations
	const filteredAndSorted = useMemo(() => {
		let result = allCombinations

		// Apply filters
		for (const [dimName, selectedValues] of Object.entries(filters)) {
			if (selectedValues.size > 0) {
				result = result.filter((combo) => {
					const value = combo.values[dimName]
					return selectedValues.has(value)
				})
			}
		}

		// Apply multi-priority sorting
		if (sortItems.length > 0) {
			result = [...result].sort((a, b) => multiFieldCompare({ a, b, sortItems }))
		}

		return result
	}, [allCombinations, filters, sortItems])

	// Track if any filters are active
	const hasActiveFilters = useMemo(() => Object.values(filters).some((set) => set.size > 0), [filters])

	const hasActiveSort = sortItems.length > 0

	// Compute badge text (extracted to avoid nested ternary)
	const badgeText = useMemo(() => {
		if (hasActiveFilters) {
			const totalText = truncated ? `${allCombinations.length}+` : total
			return `${filteredAndSorted.length} of ${totalText}`
		}
		if (truncated) {
			return `${allCombinations.length} of ${total}`
		}
		return String(total)
	}, [hasActiveFilters, truncated, allCombinations.length, filteredAndSorted.length, total])

	// Measure the first cell once it's rendered
	const measureFirstCell = useCallback((node: HTMLDivElement | null) => {
		if (!node || hasMeasuredRef.current) return

		requestAnimationFrame(() => {
			const rect = node.getBoundingClientRect()
			if (rect.width > 0 && rect.height > 0) {
				hasMeasuredRef.current = true
				setCellDimensions({
					width: Math.ceil(rect.width),
					height: Math.ceil(rect.height),
				})
			}
		})
	}, [])

	const handleCellClick = useCallback(
		(combo: PropCombination) => {
			// Find the index in the filtered list
			setSelectedIndex((prev) => {
				const newIndex = filteredAndSorted.indexOf(combo)
				return prev === newIndex ? null : newIndex
			})
		},
		[filteredAndSorted],
	)

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

	const handleFilterChange = useCallback(
		({ dimName, value, checked }: { dimName: string; value: unknown; checked: boolean }) => {
			setFilters((prev) => {
				const newFilters = { ...prev }
				const currentSet = newFilters[dimName] ?? new Set()
				const newSet = new Set(currentSet)

				if (checked) {
					newSet.add(value)
				} else {
					newSet.delete(value)
				}

				newFilters[dimName] = newSet
				return newFilters
			})
		},
		[],
	)

	const handleClearFilter = useCallback((dimName: string) => {
		setFilters((prev) => {
			const newFilters = { ...prev }
			delete newFilters[dimName]
			return newFilters
		})
	}, [])

	const handleResetAll = useCallback(() => {
		setFilters({})
		setSortItems([])
	}, [])

	// Add or toggle a sort field
	const handleAddSort = useCallback((field: string) => {
		setSortItems((prev) => {
			const existingIndex = prev.findIndex((item) => item.field === field)
			if (existingIndex >= 0) {
				// Toggle direction
				const existing = prev[existingIndex]
				if (!existing) return prev
				const newItems = [...prev]
				newItems[existingIndex] = { ...existing, direction: existing.direction === "asc" ? "desc" : "asc" }
				return newItems
			}
			// Add new sort at the end
			return [...prev, { field, direction: "asc" }]
		})
	}, [])

	// Remove a sort field
	const handleRemoveSort = useCallback((field: string) => {
		setSortItems((prev) => prev.filter((item) => item.field !== field))
	}, [])

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
		const selected = filteredAndSorted[selectedIndex]
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

	// Calculate grid layout
	const columns = Math.max(1, Math.floor((containerWidth + CELL_GAP) / (cellDimensions.width + CELL_GAP)))
	const rowCount = Math.ceil(filteredAndSorted.length / columns)

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.headerLeft}>
					<h1 className={styles.title}>{title}</h1>
					<span className={styles.badge}>{badgeText}</span>
				</div>

				{/* Filter chips inline in header */}
				{dimensions.length > 0 && (
					<div className={styles.headerFilters}>
						{dimensions.map((dim) => {
							const selectedValues = filters[dim.name] ?? new Set()
							return (
								<FilterChip
									key={dim.name}
									dimension={dim}
									selectedValues={selectedValues}
									onFilterChange={(value, checked) => handleFilterChange({ dimName: dim.name, value, checked })}
									onClearFilter={() => handleClearFilter(dim.name)}
								/>
							)
						})}
					</div>
				)}

				<div className={styles.headerControls}>
					{/* Sort menu */}
					{dimensions.length > 0 && (
						<SortMenu
							dimensions={dimensions}
							sortItems={sortItems}
							onAddSort={handleAddSort}
							onRemoveSort={handleRemoveSort}
							onToggleDirection={handleAddSort}
						/>
					)}

					{/* Reset button */}
					{(hasActiveFilters || hasActiveSort) && (
						<Tooltip content="Reset all">
							<button type="button" onClick={handleResetAll} className={styles.resetButton}>
								<RotateCcw size={14} />
							</button>
						</Tooltip>
					)}

					<span className={styles.divider} />
					<BackgroundSwitcher value={background} onChange={setBackground} />
				</div>
			</header>

			{truncated && !hasActiveFilters && (
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
						Showing {allCombinations.length} of {total} total combinations. Use filters to narrow down.
					</span>
				</div>
			)}

			{filteredAndSorted.length === 0 ? (
				<div className={styles.emptyState}>
					<Filter size={32} />
					<p>No combinations match the current filters</p>
					<button type="button" onClick={handleResetAll} className={styles.resetButton}>
						<RotateCcw size={14} />
						Reset filters
					</button>
				</div>
			) : (
				<div ref={containerCallbackRef} className={styles.gridContainer}>
					{fullRender ? (
						<FullGrid
							combinations={filteredAndSorted}
							background={background}
							cellWidth={cellDimensions.width}
							columns={columns}
							renderStory={renderStory}
							onCellClick={handleCellClick}
							measureFirstCell={measureFirstCell}
						/>
					) : (
						<VirtualGrid
							combinations={filteredAndSorted}
							background={background}
							cellWidth={cellDimensions.width}
							cellHeight={cellDimensions.height}
							columns={columns}
							rowCount={rowCount}
							containerRef={containerRef}
							renderStory={renderStory}
							onCellClick={handleCellClick}
							measureFirstCell={measureFirstCell}
						/>
					)}
				</div>
			)}
		</div>
	)
}

// Simple filter chip - filter only, no sort
type FilterChipProps = {
	dimension: DimensionInfo
	selectedValues: Set<unknown>
	onFilterChange: (value: unknown, checked: boolean) => void
	onClearFilter: () => void
}

function FilterChip({ dimension, selectedValues, onFilterChange, onClearFilter }: FilterChipProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const hasFilter = selectedValues.size > 0

	const handleMouseEnter = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current)
			closeTimeoutRef.current = null
		}
		setIsOpen(true)
	}

	const handleMouseLeave = () => {
		closeTimeoutRef.current = setTimeout(() => {
			setIsOpen(false)
		}, 150)
	}

	useEffect(
		() => () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current)
			}
		},
		[],
	)

	return (
		<div
			role="group"
			className={styles.filterChipWrapper}
			ref={dropdownRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<button type="button" className={`${styles.filterChip} ${hasFilter ? styles.filterChipActive : ""}`}>
				<span className={styles.filterChipLabel}>{dimension.label}</span>
				{hasFilter && <span className={styles.filterCountBadge}>{selectedValues.size}</span>}
				<ChevronDown size={12} className={`${styles.chipChevron} ${isOpen ? styles.chipChevronOpen : ""}`} />
			</button>

			{isOpen && (
				<div className={styles.filterMenu}>
					<div className={styles.filterMenuHeader}>
						<span>Filter by {dimension.label.toLowerCase()}</span>
						{hasFilter && (
							<button type="button" onClick={onClearFilter} className={styles.menuClearButton}>
								Clear
							</button>
						)}
					</div>
					<div className={styles.filterOptions}>
						{dimension.values.map((value, i) => {
							const isChecked = selectedValues.has(value)
							const valueStr = formatValueForDisplay(value, dimension.name)
							return (
								<label key={i} className={styles.filterOption}>
									<input
										type="checkbox"
										checked={isChecked}
										onChange={(e) => onFilterChange(value, e.target.checked)}
										className={styles.filterCheckbox}
									/>
									<span className={styles.filterOptionLabel}>{valueStr}</span>
								</label>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

// Separate sort menu component
type SortMenuProps = {
	dimensions: DimensionInfo[]
	sortItems: SortItem[]
	onAddSort: (field: string) => void
	onRemoveSort: (field: string) => void
	onToggleDirection: (field: string) => void
}

function SortMenu({ dimensions, sortItems, onAddSort, onRemoveSort, onToggleDirection }: SortMenuProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const hasSort = sortItems.length > 0

	const handleMouseEnter = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current)
			closeTimeoutRef.current = null
		}
		setIsOpen(true)
	}

	const handleMouseLeave = () => {
		closeTimeoutRef.current = setTimeout(() => {
			setIsOpen(false)
		}, 150)
	}

	useEffect(
		() => () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current)
			}
		},
		[],
	)

	// Get current sort label for button
	const sortLabel = useMemo(() => {
		if (sortItems.length === 0) return "Sort"
		if (sortItems.length === 1) {
			const dim = dimensions.find((d) => d.name === sortItems[0]?.field)
			const direction = sortItems[0]?.direction === "asc" ? "↑" : "↓"
			return `${dim?.label} ${direction}`
		}
		return `${sortItems.length} sorts`
	}, [sortItems, dimensions])

	return (
		<div
			role="group"
			className={styles.sortMenuWrapper}
			ref={dropdownRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<button type="button" className={`${styles.sortButton} ${hasSort ? styles.sortButtonActive : ""}`}>
				<ArrowDownUp size={14} />
				<span>{sortLabel}</span>
				<ChevronDown size={12} className={`${styles.chipChevron} ${isOpen ? styles.chipChevronOpen : ""}`} />
			</button>

			{isOpen && (
				<div className={styles.sortMenu}>
					<div className={styles.sortMenuHeader}>Sort by</div>
					<div className={styles.sortOptions}>
						{dimensions.map((dim) => {
							const sortItem = sortItems.find((s) => s.field === dim.name)
							const isActive = sortItem !== undefined

							return (
								<div key={dim.name} className={styles.sortOption}>
									<button
										type="button"
										onClick={() => (isActive ? onToggleDirection(dim.name) : onAddSort(dim.name))}
										className={`${styles.sortOptionButton} ${isActive ? styles.sortOptionActive : ""}`}
									>
										<span className={styles.sortOptionLabel}>{dim.label}</span>
										{isActive && (
											<span className={styles.sortDirectionBadge}>
												{sortItem.direction === "asc" ? "↑ Asc" : "↓ Desc"}
											</span>
										)}
									</button>
									{isActive && (
										<button
											type="button"
											onClick={() => onRemoveSort(dim.name)}
											className={styles.sortRemoveButton}
											aria-label={`Remove ${dim.label} sort`}
										>
											<X size={12} />
										</button>
									)}
								</div>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

function formatValueForDisplay(value: unknown, name?: string): string {
	if (typeof value === "boolean" && name) {
		return value ? name : `!${name}`
	}
	if (typeof value === "boolean") {
		return value ? "true" : "false"
	}
	return String(value)
}

type GridProps = {
	combinations: PropCombination[]
	background: BackgroundType
	cellWidth: number
	columns: number
	renderStory: (values: Record<string, unknown>) => React.ReactNode
	onCellClick: (combo: PropCombination) => void
	measureFirstCell: (node: HTMLDivElement | null) => void
}

function FullGrid({
	combinations,
	background,
	cellWidth,
	columns,
	renderStory,
	onCellClick,
	measureFirstCell,
}: GridProps) {
	return (
		<div
			className={styles.fullGrid}
			style={{
				gridTemplateColumns: `repeat(${columns}, ${cellWidth}px)`,
			}}
		>
			{combinations.map((combo, index) => (
				<div
					key={combo.label}
					ref={index === 0 ? measureFirstCell : undefined}
					role="button"
					tabIndex={0}
					className={styles.cell}
					onClick={() => onCellClick(combo)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault()
							onCellClick(combo)
						}
					}}
					aria-label={`View ${combo.label}`}
				>
					<div className={styles.cellLabel}>{combo.label}</div>
					<div className={`${styles.cellContent} ${CELL_CONTENT_CLASSES[background] ?? ""}`}>
						{renderStory(combo.values)}
					</div>
				</div>
			))}
		</div>
	)
}

type VirtualGridProps = GridProps & {
	cellHeight: number
	rowCount: number
	containerRef: React.RefObject<HTMLDivElement | null>
}

function VirtualGrid({
	combinations,
	background,
	cellWidth,
	cellHeight,
	columns,
	rowCount,
	containerRef,
	renderStory,
	onCellClick,
	measureFirstCell,
}: VirtualGridProps) {
	const rowVirtualizer = useVirtualizer({
		count: rowCount,
		getScrollElement: () => containerRef.current,
		estimateSize: () => cellHeight + CELL_GAP,
		overscan: 2,
	})

	const virtualRows = rowVirtualizer.getVirtualItems()

	return (
		<div
			className={styles.virtualGrid}
			style={{
				height: `${rowVirtualizer.getTotalSize()}px`,
			}}
		>
			{virtualRows.map((virtualRow) => {
				const rowStartIndex = virtualRow.index * columns
				const rowCells = combinations.slice(rowStartIndex, rowStartIndex + columns)

				return (
					<div
						key={virtualRow.key}
						className={styles.virtualRow}
						style={{
							height: `${virtualRow.size}px`,
							transform: `translateY(${virtualRow.start}px)`,
						}}
					>
						{rowCells.map((combo, cellIndex) => {
							const globalIndex = rowStartIndex + cellIndex
							return (
								<div
									key={combo.label}
									ref={globalIndex === 0 ? measureFirstCell : undefined}
									role="button"
									tabIndex={0}
									className={styles.cell}
									style={{
										width: cellWidth,
										left: cellIndex * (cellWidth + CELL_GAP),
									}}
									onClick={() => onCellClick(combo)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault()
											onCellClick(combo)
										}
									}}
									aria-label={`View ${combo.label}`}
								>
									<div className={styles.cellLabel}>{combo.label}</div>
									<div className={`${styles.cellContent} ${CELL_CONTENT_CLASSES[background] ?? ""}`}>
										{renderStory(combo.values)}
									</div>
								</div>
							)
						})}
					</div>
				)
			})}
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
