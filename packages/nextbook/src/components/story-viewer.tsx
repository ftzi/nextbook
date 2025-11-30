"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { z } from "zod"
import { isMatrixStory } from "../story-matrix"
import type { ControlConfig, MatrixStory, Story } from "../types"
import { getSchemaDefaults, schemaToControls } from "../utils/schema"
import { ControlsPanel, DEFAULT_SIZE_BOTTOM, DEFAULT_SIZE_RIGHT } from "./controls-panel"
import { MatrixViewer } from "./matrix-viewer"
import styles from "./story-viewer.module.css"
import { Tooltip } from "./tooltip"

type BackgroundType = "default" | "striped"
type PanelPosition = "bottom" | "right"

type StoryViewerProps = {
	story: Story<z.ZodType | undefined> | MatrixStory<z.ZodObject<z.ZodRawShape>>
	storyType: "simple" | "controlled" | "matrix"
	title: string
}

const DEFAULT_ZOOM = 1
const MIN_ZOOM = 0.25
const MAX_ZOOM = 3
const ZOOM_STEP = 0.1

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: component manages multiple related states (zoom, pan, controls, background)
export function StoryViewer({ story, storyType, title }: StoryViewerProps) {
	const [controls, setControls] = useState<ControlConfig[]>([])
	const [values, setValues] = useState<Record<string, unknown>>({})
	const [defaultValues, setDefaultValues] = useState<Record<string, unknown>>({})
	const [background, setBackground] = useState<BackgroundType>("default")

	// Controls panel state
	const [panelPosition, setPanelPosition] = useState<PanelPosition>("bottom")
	const [panelSizeBottom, setPanelSizeBottom] = useState(DEFAULT_SIZE_BOTTOM)
	const [panelSizeRight, setPanelSizeRight] = useState(DEFAULT_SIZE_RIGHT)
	const [panelCollapsed, setPanelCollapsed] = useState(false)

	const panelSize = panelPosition === "bottom" ? panelSizeBottom : panelSizeRight
	const setPanelSize = panelPosition === "bottom" ? setPanelSizeBottom : setPanelSizeRight

	// Pan and zoom state
	const [zoom, setZoom] = useState(DEFAULT_ZOOM)
	const [pan, setPan] = useState({ x: 0, y: 0 })
	const [isPanEnabled, setIsPanEnabled] = useState(true)
	const [isDragging, setIsDragging] = useState(false)
	const dragStart = useRef({ x: 0, y: 0 })
	const panStart = useRef({ x: 0, y: 0 })
	const canvasRef = useRef<HTMLDivElement>(null)

	const resetView = useCallback(() => {
		setZoom(DEFAULT_ZOOM)
		setPan({ x: 0, y: 0 })
	}, [])

	const isDefaultView = zoom === DEFAULT_ZOOM && pan.x === 0 && pan.y === 0

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				resetView()
			}
		}
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [resetView])

	// Handle wheel zoom with debounce to handle macOS smooth scrolling
	const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
	const accumulatedDelta = useRef(0)
	const WHEEL_DEBOUNCE_MS = 100

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault()

			// Accumulate delta from smooth scrolling
			accumulatedDelta.current += e.deltaY

			// Clear existing timeout
			if (wheelTimeout.current) {
				clearTimeout(wheelTimeout.current)
			}

			// Debounce: wait for scroll gesture to finish
			wheelTimeout.current = setTimeout(() => {
				const direction = accumulatedDelta.current > 0 ? -1 : 1
				setZoom((prev) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + direction * ZOOM_STEP)))
				accumulatedDelta.current = 0
			}, WHEEL_DEBOUNCE_MS)
		}

		canvas.addEventListener("wheel", handleWheel, { passive: false })
		return () => {
			canvas.removeEventListener("wheel", handleWheel)
			if (wheelTimeout.current) {
				clearTimeout(wheelTimeout.current)
			}
		}
	}, [])

	// Handle drag with document-level events so panning continues outside canvas
	useEffect(() => {
		if (!isDragging) return

		const handleMouseMove = (e: MouseEvent) => {
			const dx = e.clientX - dragStart.current.x
			const dy = e.clientY - dragStart.current.y
			setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy })
		}

		const handleMouseUp = () => {
			setIsDragging(false)
		}

		document.addEventListener("mousemove", handleMouseMove)
		document.addEventListener("mouseup", handleMouseUp)

		return () => {
			document.removeEventListener("mousemove", handleMouseMove)
			document.removeEventListener("mouseup", handleMouseUp)
		}
	}, [isDragging])

	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.button !== 0 || !isPanEnabled) return
		setIsDragging(true)
		dragStart.current = { x: e.clientX, y: e.clientY }
		panStart.current = { x: pan.x, y: pan.y }
	}

	// Extract controls from schema
	useEffect(() => {
		if (storyType === "controlled" && story.schema) {
			try {
				const schemaControls = schemaToControls(story.schema as z.ZodObject<z.ZodRawShape>)
				const schemaDefaults = getSchemaDefaults(story.schema as z.ZodObject<z.ZodRawShape>)

				setControls(schemaControls)
				setDefaultValues(schemaDefaults)
				setValues(schemaDefaults)
			} catch (err) {
				console.warn("[nextbook] Could not extract controls from schema:", err)
				setControls([])
				setDefaultValues({})
				setValues({})
			}
		} else {
			setControls([])
			setDefaultValues({})
			setValues({})
		}
	}, [story.schema, storyType])

	// Reset view when story changes
	useEffect(() => {
		resetView()
	}, [resetView])

	const handleChange = (name: string, value: unknown) => {
		setValues((prev) => ({ ...prev, [name]: value }))
	}

	const handleReset = () => {
		setValues(defaultValues)
	}

	// Render MatrixViewer for matrix stories
	if (storyType === "matrix" && isMatrixStory(story)) {
		return <MatrixViewer story={story} title={title} />
	}

	const renderStory = () => {
		try {
			if (storyType === "controlled" && story.schema) {
				return (story.render as (props: Record<string, unknown>) => React.ReactNode)(values)
			}
			return (story.render as () => React.ReactNode)()
		} catch (err) {
			console.error("[nextbook] Error rendering story:", err)
			return (
				<div className={styles.error}>
					<p className={styles.errorTitle}>Error rendering story</p>
					<p className={styles.errorMessage}>{String(err)}</p>
				</div>
			)
		}
	}

	const canvasClassName = `${styles.canvas ?? ""} ${background === "striped" ? (styles.canvasStriped ?? "") : (styles.canvasDefault ?? "")} ${isDragging ? (styles.canvasDragging ?? "") : ""} ${isPanEnabled ? "" : (styles.canvasNoPan ?? "")}`

	const hasControls = controls.length > 0
	const containerClassName = `${styles.container} ${hasControls && panelPosition === "right" ? styles.containerWithRightPanel : ""}`

	return (
		<div className={containerClassName}>
			<div className={styles.mainArea}>
				{/* Header */}
				<header className={styles.header}>
					<h1 className={styles.title}>{title}</h1>
					<div className={styles.headerControls}>
						<PanToggle enabled={isPanEnabled} onChange={setIsPanEnabled} />
						<div className={styles.divider} />
						<ZoomControls
							zoom={zoom}
							onZoomIn={() => setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP))}
							onZoomOut={() => setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP))}
							onZoomChange={(value) => setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)))}
							onReset={resetView}
							isDefaultView={isDefaultView}
						/>
						<div className={styles.divider} />
						<BackgroundSwitcher value={background} onChange={setBackground} />
					</div>
				</header>

				{/* Story canvas */}
				{/* biome-ignore lint/a11y/noStaticElementInteractions: canvas needs drag events for pan functionality */}
				<div ref={canvasRef} className={canvasClassName} onMouseDown={handleMouseDown}>
					<div
						className={styles.canvasInner}
						style={{
							transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
						}}
					>
						<div className={styles.storyFrame}>{renderStory()}</div>
					</div>
				</div>

				{/* Controls panel - bottom position */}
				{hasControls && panelPosition === "bottom" && (
					<ControlsPanel
						controls={controls}
						values={values}
						onChange={handleChange}
						onReset={handleReset}
						position={panelPosition}
						onPositionChange={setPanelPosition}
						size={panelSize}
						onSizeChange={setPanelSize}
						collapsed={panelCollapsed}
						onCollapsedChange={setPanelCollapsed}
					/>
				)}
			</div>

			{/* Controls panel - right position */}
			{hasControls && panelPosition === "right" && (
				<ControlsPanel
					controls={controls}
					values={values}
					onChange={handleChange}
					onReset={handleReset}
					position={panelPosition}
					onPositionChange={setPanelPosition}
					size={panelSize}
					onSizeChange={setPanelSize}
					collapsed={panelCollapsed}
					onCollapsedChange={setPanelCollapsed}
				/>
			)}
		</div>
	)
}

function ZoomControls({
	zoom,
	onZoomIn,
	onZoomOut,
	onZoomChange,
	onReset,
	isDefaultView,
}: {
	zoom: number
	onZoomIn: () => void
	onZoomOut: () => void
	onZoomChange: (value: number) => void
	onReset: () => void
	isDefaultView: boolean
}) {
	const zoomPercent = Math.round(zoom * 100)
	const [inputValue, setInputValue] = useState(String(zoomPercent))

	useEffect(() => {
		setInputValue(String(zoomPercent))
	}, [zoomPercent])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleInputBlur = () => {
		const parsed = Number.parseInt(inputValue, 10)
		if (Number.isNaN(parsed)) {
			setInputValue(String(zoomPercent))
		} else {
			onZoomChange(parsed / 100)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.currentTarget.blur()
		}
	}

	return (
		<div className={styles.zoomControls}>
			<Tooltip content="Zoom out">
				<button type="button" onClick={onZoomOut} className={styles.zoomButton} disabled={zoom <= MIN_ZOOM}>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
						<path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
				</button>
			</Tooltip>
			<div className={styles.zoomInputWrapper}>
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					onKeyDown={handleKeyDown}
					className={styles.zoomInput}
					aria-label="Zoom percentage"
				/>
				<span className={styles.zoomInputSuffix}>%</span>
			</div>
			<Tooltip content="Zoom in">
				<button type="button" onClick={onZoomIn} className={styles.zoomButton} disabled={zoom >= MAX_ZOOM}>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
						<path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
				</button>
			</Tooltip>
			<Tooltip content="Reset view (Esc)">
				<button type="button" onClick={onReset} className={styles.zoomButton} disabled={isDefaultView}>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
						<path
							d="M2.5 2.5v3h3"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path d="M2.5 7a4.5 4.5 0 1 1 1.32 3.18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
				</button>
			</Tooltip>
		</div>
	)
}

function BackgroundSwitcher({ value, onChange }: { value: BackgroundType; onChange: (value: BackgroundType) => void }) {
	return (
		<div className={styles.backgroundSwitcher}>
			<Tooltip content="Default">
				<button
					type="button"
					onClick={() => onChange("default")}
					className={`${styles.bgButton} ${value === "default" ? styles.bgButtonActive : ""}`}
				>
					<span className={`${styles.bgButtonInner} ${styles.bgDefault}`} />
				</button>
			</Tooltip>
			<Tooltip content="Striped">
				<button
					type="button"
					onClick={() => onChange("striped")}
					className={`${styles.bgButton} ${value === "striped" ? styles.bgButtonActive : ""}`}
				>
					<span className={`${styles.bgButtonInner} ${styles.bgStriped}`} />
				</button>
			</Tooltip>
		</div>
	)
}

function PanToggle({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) {
	return (
		<Tooltip content={enabled ? "Disable panning" : "Enable panning"}>
			<button
				type="button"
				onClick={() => onChange(!enabled)}
				className={`${styles.panButton} ${enabled ? styles.panButtonActive : ""}`}
				aria-pressed={enabled}
			>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
					{/* Hand/grab icon */}
					<path
						d="M10 4.5V3a1 1 0 0 0-2 0v1.5M8 4.5V2.5a1 1 0 0 0-2 0v2M6 4.5V3a1 1 0 0 0-2 0v4l-.7-.7a1 1 0 0 0-1.4 1.4l2.6 2.6c.8.8 1.8 1.2 2.9 1.2h.6a4 4 0 0 0 4-4V4.5a1 1 0 0 0-2 0"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</Tooltip>
	)
}
