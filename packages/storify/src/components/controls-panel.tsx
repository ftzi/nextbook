"use client"

import { useEffect, useRef } from "react"
import type { ControlConfig } from "../types"
import styles from "./controls-panel.module.css"
import { Tooltip } from "./tooltip"

type PanelPosition = "bottom" | "right"

type ControlsPanelProps = {
	controls: ControlConfig[]
	values: Record<string, unknown>
	onChange: (name: string, value: unknown) => void
	onReset: () => void
	position: PanelPosition
	onPositionChange: (position: PanelPosition) => void
	size: number
	onSizeChange: (size: number) => void
	collapsed: boolean
	onCollapsedChange: (collapsed: boolean) => void
}

const MIN_SIZE_BOTTOM = 100
const MIN_SIZE_RIGHT = 200
const MAX_SIZE = 500
const DEFAULT_SIZE_BOTTOM = 300
const DEFAULT_SIZE_RIGHT = 200

export function ControlsPanel({
	controls,
	values,
	onChange,
	onReset,
	position,
	onPositionChange,
	size,
	onSizeChange,
	collapsed,
	onCollapsedChange,
}: ControlsPanelProps) {
	const isDragging = useRef(false)
	const startPos = useRef(0)
	const startSize = useRef(0)

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging.current) return

			const delta = position === "bottom" ? startPos.current - e.clientY : startPos.current - e.clientX
			const minSize = position === "bottom" ? MIN_SIZE_BOTTOM : MIN_SIZE_RIGHT

			const newSize = Math.min(MAX_SIZE, Math.max(minSize, startSize.current + delta))
			onSizeChange(newSize)
		}

		const handleMouseUp = () => {
			isDragging.current = false
			document.body.style.cursor = ""
			document.body.style.userSelect = ""
		}

		document.addEventListener("mousemove", handleMouseMove)
		document.addEventListener("mouseup", handleMouseUp)

		return () => {
			document.removeEventListener("mousemove", handleMouseMove)
			document.removeEventListener("mouseup", handleMouseUp)
		}
	}, [position, onSizeChange])

	const handleResizeStart = (e: React.MouseEvent) => {
		isDragging.current = true
		startPos.current = position === "bottom" ? e.clientY : e.clientX
		startSize.current = size
		document.body.style.cursor = position === "bottom" ? "row-resize" : "col-resize"
		document.body.style.userSelect = "none"
	}

	if (controls.length === 0) {
		return null
	}

	const panelClassName = `${styles.panel} ${position === "right" ? styles.panelRight : styles.panelBottom} ${collapsed ? styles.panelCollapsed : ""}`
	const resizeHandleClassName = `${styles.resizeHandle} ${position === "right" ? styles.resizeHandleRight : styles.resizeHandleBottom}`

	const getSizeStyle = () => {
		if (collapsed) return undefined
		if (position === "bottom") return { height: size }
		return { width: size }
	}

	const getCollapseIcon = () => {
		if (collapsed && position === "bottom") {
			return (
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
					<path d="M3 9l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			)
		}
		if (collapsed && position === "right") {
			return (
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
					<path
						d="M9 3l-4 4 4 4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			)
		}
		if (!collapsed && position === "bottom") {
			return (
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
					<path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			)
		}
		return (
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
				<path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)
	}

	return (
		<div className={panelClassName} style={getSizeStyle()}>
			{!collapsed && (
				/* biome-ignore lint/a11y/noStaticElementInteractions: resize handle needs mouse events */
				<div className={resizeHandleClassName} onMouseDown={handleResizeStart} />
			)}
			<div className={styles.header}>
				{position === "right" && (
					<Tooltip content={collapsed ? "Expand" : "Collapse"}>
						<button type="button" onClick={() => onCollapsedChange(!collapsed)} className={styles.positionButton}>
							{getCollapseIcon()}
						</button>
					</Tooltip>
				)}
				<span className={styles.headerTitle}>Controls</span>
				<div className={styles.headerActions}>
					{position === "bottom" && (
						<Tooltip content={collapsed ? "Expand" : "Collapse"}>
							<button type="button" onClick={() => onCollapsedChange(!collapsed)} className={styles.positionButton}>
								{getCollapseIcon()}
							</button>
						</Tooltip>
					)}
					<Tooltip content={position === "bottom" ? "Move to right" : "Move to bottom"}>
						<button
							type="button"
							onClick={() => onPositionChange(position === "bottom" ? "right" : "bottom")}
							className={styles.positionButton}
						>
							{position === "bottom" ? (
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
									<rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
									<path d="M9 1v12" stroke="currentColor" strokeWidth="1.5" />
								</svg>
							) : (
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
									<rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
									<path d="M1 9h12" stroke="currentColor" strokeWidth="1.5" />
								</svg>
							)}
						</button>
					</Tooltip>
					<Tooltip content="Reset controls">
						<button type="button" onClick={onReset} className={styles.resetButton}>
							Reset
						</button>
					</Tooltip>
				</div>
			</div>
			{!collapsed && (
				<div className={styles.controlsList}>
					<GroupedControls controls={controls} values={values} onChange={onChange} />
				</div>
			)}
		</div>
	)
}

export { DEFAULT_SIZE_BOTTOM, DEFAULT_SIZE_RIGHT }

type GroupedControlsProps = {
	controls: ControlConfig[]
	values: Record<string, unknown>
	onChange: (name: string, value: unknown) => void
}

function GroupedControls({ controls, values, onChange }: GroupedControlsProps) {
	// Group controls by type category
	const textControls = controls.filter((c) => c.type === "text" || c.type === "number")
	const selectControls = controls.filter((c) => c.type === "select")
	const booleanControls = controls.filter((c) => c.type === "boolean")

	return (
		<>
			{/* Text/Number inputs */}
			{textControls.length > 0 && (
				<div className={styles.controlGroup}>
					<div className={styles.controlRow}>
						{textControls.map((control) => (
							<TextControl
								key={control.name}
								control={control}
								value={values[control.name]}
								onChange={(value) => onChange(control.name, value)}
							/>
						))}
					</div>
				</div>
			)}

			{/* Select inputs */}
			{selectControls.length > 0 && (
				<div className={styles.controlGroup}>
					<div className={styles.controlRow}>
						{selectControls.map((control) => (
							<SelectControl
								key={control.name}
								control={control}
								value={values[control.name]}
								onChange={(value) => onChange(control.name, value)}
							/>
						))}
					</div>
				</div>
			)}

			{/* Boolean switches */}
			{booleanControls.length > 0 && (
				<div className={styles.controlGroup}>
					<div className={styles.switchRow}>
						{booleanControls.map((control) => (
							<SwitchControl
								key={control.name}
								control={control}
								value={values[control.name]}
								onChange={(value) => onChange(control.name, value)}
							/>
						))}
					</div>
				</div>
			)}
		</>
	)
}

type ControlFieldProps = {
	control: ControlConfig
	value: unknown
	onChange: (value: unknown) => void
}

function DescriptionIcon({ description }: { description?: string }) {
	if (!description) return null

	return (
		<Tooltip content={description}>
			<span className={styles.infoIcon}>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
					<circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
					<path d="M6 5.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
					<circle cx="6" cy="3.75" r="0.75" fill="currentColor" />
				</svg>
			</span>
		</Tooltip>
	)
}

function TextControl({ control, value, onChange }: ControlFieldProps) {
	const { type, name, label, description } = control

	return (
		<div className={styles.field}>
			<label htmlFor={`control-${name}`} className={styles.label}>
				{label}
				<DescriptionIcon description={description} />
			</label>
			<input
				id={`control-${name}`}
				type={type === "number" ? "number" : "text"}
				value={type === "number" ? Number(value ?? 0) : String(value ?? "")}
				onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
				className={styles.input}
			/>
		</div>
	)
}

function SelectControl({ control, value, onChange }: ControlFieldProps) {
	const { name, label, description, options } = control

	return (
		<div className={styles.field}>
			<label htmlFor={`control-${name}`} className={styles.label}>
				{label}
				<DescriptionIcon description={description} />
			</label>
			<select
				id={`control-${name}`}
				value={String(value ?? "")}
				onChange={(e) => onChange(e.target.value)}
				className={`${styles.input} ${styles.select}`}
			>
				{options?.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	)
}

function SwitchControl({ control, value, onChange }: ControlFieldProps) {
	const { name, label, description } = control

	return (
		<div className={styles.switchField}>
			<label htmlFor={`control-${name}`} className={styles.label}>
				{label}
				<DescriptionIcon description={description} />
			</label>
			<button
				type="button"
				id={`control-${name}`}
				onClick={() => onChange(!value)}
				className={`${styles.toggle} ${value ? styles.toggleActive : ""}`}
			>
				<span className={`${styles.toggleKnob} ${value ? styles.toggleKnobActive : ""}`} />
			</button>
		</div>
	)
}
