"use client"

import { useEffect, useState } from "react"
import type { z } from "zod"
import type { ControlConfig, Story } from "../types"
import { getSchemaDefaults, schemaToControls } from "../utils/schema"
import { ControlsPanel } from "./controls-panel"
import styles from "./story-viewer.module.css"

type BackgroundType = "default" | "striped"

type StoryViewerProps = {
	loader: () => Promise<Record<string, unknown>>
	exportName: string
	title: string
}

export function StoryViewer({ loader, exportName, title }: StoryViewerProps) {
	const [story, setStory] = useState<Story<z.ZodType | undefined> | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [controls, setControls] = useState<ControlConfig[]>([])
	const [values, setValues] = useState<Record<string, unknown>>({})
	const [defaultValues, setDefaultValues] = useState<Record<string, unknown>>({})
	const [background, setBackground] = useState<BackgroundType>("default")

	useEffect(() => {
		setLoading(true)
		setError(null)

		loader()
			.then((mod) => {
				const matchingKey = Object.keys(mod).find((key) => key.toLowerCase() === exportName.toLowerCase())
				const exportedStory = matchingKey ? mod[matchingKey] : undefined

				if (exportedStory && typeof exportedStory === "object" && "__nextbook" in exportedStory) {
					setStory(exportedStory as Story<z.ZodType | undefined>)
				} else {
					setError(`Export "${exportName}" not found or not a valid story`)
				}
			})
			.catch((err) => {
				setError(String(err))
			})
			.finally(() => {
				setLoading(false)
			})
	}, [loader, exportName])

	useEffect(() => {
		if (story?.schema) {
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
	}, [story?.schema])

	const handleChange = (name: string, value: unknown) => {
		setValues((prev) => ({ ...prev, [name]: value }))
	}

	const handleReset = () => {
		setValues(defaultValues)
	}

	const renderStory = () => {
		if (loading) {
			return null
		}

		if (error) {
			return (
				<div className={styles.error}>
					<p className={styles.errorTitle}>Error loading story</p>
					<p className={styles.errorMessage}>{error}</p>
				</div>
			)
		}

		if (!story) {
			return (
				<div className={styles.error}>
					<p className={styles.errorTitle}>Story not found</p>
				</div>
			)
		}

		try {
			if (story.schema) {
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

	const canvasClassName = `${styles.canvas ?? ""} ${background === "striped" ? (styles.canvasStriped ?? "") : (styles.canvasDefault ?? "")}`

	return (
		<div className={styles.container}>
			{/* Header */}
			<header className={styles.header}>
				<h1 className={styles.title}>{title}</h1>
				<BackgroundSwitcher value={background} onChange={setBackground} />
			</header>

			{/* Story canvas */}
			<div className={canvasClassName}>
				<div className={styles.canvasInner}>
					<div className={styles.storyFrame}>{renderStory()}</div>
				</div>
			</div>

			{/* Controls panel */}
			{controls.length > 0 && (
				<ControlsPanel controls={controls} values={values} onChange={handleChange} onReset={handleReset} />
			)}
		</div>
	)
}

function BackgroundSwitcher({ value, onChange }: { value: BackgroundType; onChange: (value: BackgroundType) => void }) {
	return (
		<div className={styles.backgroundSwitcher}>
			<button
				type="button"
				onClick={() => onChange("default")}
				className={`${styles.bgButton} ${value === "default" ? styles.bgButtonActive : ""}`}
				title="Default"
			>
				<span className={`${styles.bgButtonInner} ${styles.bgDefault}`}>Aa</span>
			</button>
			<button
				type="button"
				onClick={() => onChange("striped")}
				className={`${styles.bgButton} ${value === "striped" ? styles.bgButtonActive : ""}`}
				title="Striped"
			>
				<span className={`${styles.bgButtonInner} ${styles.bgStriped}`} />
			</button>
		</div>
	)
}
