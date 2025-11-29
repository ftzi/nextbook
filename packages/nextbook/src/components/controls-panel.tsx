"use client"

import type { ControlConfig } from "../types"
import styles from "./controls-panel.module.css"

type ControlsPanelProps = {
	controls: ControlConfig[]
	values: Record<string, unknown>
	onChange: (name: string, value: unknown) => void
	onReset: () => void
}

export function ControlsPanel({ controls, values, onChange, onReset }: ControlsPanelProps) {
	if (controls.length === 0) {
		return null
	}

	return (
		<div className={styles.panel}>
			<div className={styles.header}>
				<span className={styles.headerTitle}>Controls</span>
				<button type="button" onClick={onReset} className={styles.resetButton}>
					Reset
				</button>
			</div>
			<div className={styles.controlsList}>
				{controls.map((control) => (
					<ControlField
						key={control.name}
						control={control}
						value={values[control.name]}
						onChange={(value) => onChange(control.name, value)}
					/>
				))}
			</div>
		</div>
	)
}

type ControlFieldProps = {
	control: ControlConfig
	value: unknown
	onChange: (value: unknown) => void
}

function ControlField({ control, value, onChange }: ControlFieldProps) {
	const { type, name, label } = control

	return (
		<div className={styles.field}>
			<label htmlFor={`control-${name}`} className={styles.label}>
				{label}
			</label>
			{type === "text" && (
				<input
					id={`control-${name}`}
					type="text"
					value={String(value ?? "")}
					onChange={(e) => onChange(e.target.value)}
					className={styles.input}
				/>
			)}
			{type === "number" && (
				<input
					id={`control-${name}`}
					type="number"
					value={Number(value ?? 0)}
					onChange={(e) => onChange(Number(e.target.value))}
					className={styles.input}
				/>
			)}
			{type === "boolean" && (
				<button
					type="button"
					id={`control-${name}`}
					onClick={() => onChange(!value)}
					className={`${styles.toggle} ${value ? styles.toggleActive : ""}`}
				>
					<span className={`${styles.toggleKnob} ${value ? styles.toggleKnobActive : ""}`} />
				</button>
			)}
			{type === "select" && control.options && (
				<select
					id={`control-${name}`}
					value={String(value ?? "")}
					onChange={(e) => onChange(e.target.value)}
					className={`${styles.input} ${styles.select}`}
				>
					{control.options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			)}
		</div>
	)
}
