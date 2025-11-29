"use client"

import { Component, type ReactNode, useEffect, useState } from "react"
import type { Stories, StoryTreeNode } from "../types"
import LogoAnimated from "./icons/logo-animated"
import styles from "./story-page.module.css"
import { extractStoryExports, StoryTabs } from "./story-tabs"
import { StoryViewer } from "./story-viewer"

type StoryPageProps = {
	path: string[]
	stories: Stories
	basePath?: string
}

/**
 * Error boundary to catch story rendering errors.
 */
class StoryErrorBoundary extends Component<
	{ children: ReactNode; onReset?: () => void },
	{ hasError: boolean; error: Error | null }
> {
	constructor(props: { children: ReactNode; onReset?: () => void }) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error }
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className={styles.errorBoundary}>
					<p className={styles.errorBoundaryTitle}>Story crashed</p>
					<p className={styles.errorBoundaryMessage}>{this.state.error?.message}</p>
					<button
						type="button"
						onClick={() => {
							this.setState({ hasError: false, error: null })
							this.props.onReset?.()
						}}
						className={styles.errorBoundaryButton}
					>
						Try again
					</button>
				</div>
			)
		}

		return this.props.children
	}
}

/**
 * Count total story files in the tree.
 */
function countStoryFiles(tree: StoryTreeNode[]): number {
	let count = 0
	for (const node of tree) {
		if (node.filePath) count++
		if (node.children) count += countStoryFiles(node.children)
	}
	return count
}

/**
 * Find a node in the tree by path segments.
 */
function findNodeByPath(tree: StoryTreeNode[], path: string[]): StoryTreeNode | null {
	if (path.length === 0) return null

	let currentLevel = tree

	for (let i = 0; i < path.length; i++) {
		const segment = path[i] as string
		const node = currentLevel.find((n) => n.segment.toLowerCase() === segment.toLowerCase())

		if (!node) return null

		if (i === path.length - 1) {
			return node
		}

		if (!node.children) return null
		currentLevel = node.children
	}

	return null
}

/**
 * Find a story file node by trying different path interpretations.
 * The path could be:
 * - ["button"] - just the file name
 * - ["button", "Default"] - file name + export name
 * - ["forms", "input"] - nested directory + file name
 * - ["forms", "input", "Default"] - nested + file + export
 *
 * Returns the node and remaining path segments (export name if any).
 */
function findStoryFile(
	tree: StoryTreeNode[],
	path: string[],
): { node: StoryTreeNode; exportName: string | null } | null {
	// Try progressively shorter paths to find a node with filePath
	for (let i = path.length; i >= 1; i--) {
		const nodePath = path.slice(0, i)
		const node = findNodeByPath(tree, nodePath)

		if (node?.filePath) {
			// Found a story file node
			const remainingPath = path.slice(i)
			const exportName = remainingPath.length > 0 ? (remainingPath[0] as string) : null
			return { node, exportName }
		}
	}

	return null
}

/**
 * Client component for rendering stories with tabbed navigation.
 * Handles the welcome page, story lookup, and lazy loading.
 */
export function StoryPage({ path, stories, basePath = "/ui" }: StoryPageProps) {
	const { tree, loaders } = stories

	// Welcome page
	if (path.length === 0) {
		const storyCount = countStoryFiles(tree)
		return (
			<div className={styles.welcome}>
				<AnimatedLogo className={styles.welcomeLogo} />
				<p className={styles.welcomeSubtitle}>Select a story from the sidebar to get started.</p>
				<p className={styles.welcomeCount}>
					{storyCount} {storyCount === 1 ? "story" : "stories"} available
				</p>
			</div>
		)
	}

	// Try to find a story file in the path
	const result = findStoryFile(tree, path)

	if (!result) {
		// Maybe it's a directory node
		const dirNode = findNodeByPath(tree, path)
		if (dirNode && !dirNode.filePath && dirNode.children && dirNode.children.length > 0) {
			return (
				<div className={styles.placeholder}>
					<h1 className={styles.placeholderTitle}>{dirNode.name}</h1>
					<p className={styles.placeholderText}>Select a story from the sidebar.</p>
				</div>
			)
		}

		return (
			<div className={styles.placeholder}>
				<h1 className={styles.placeholderTitle}>Story not found</h1>
				<p className={styles.placeholderText}>The requested story does not exist.</p>
			</div>
		)
	}

	const { node, exportName } = result

	// Get loader for this file
	const loader = loaders[node.filePath as string]
	if (!loader) {
		return (
			<div className={styles.placeholder}>
				<h1 className={styles.placeholderTitle}>Loader not found</h1>
				<p className={styles.placeholderText}>No loader for: {node.filePath}</p>
			</div>
		)
	}

	return (
		<TabbedStoryView
			key={node.filePath}
			loader={loader}
			filePath={node.filePath as string}
			componentName={node.name}
			requestedExport={exportName}
			basePath={basePath}
		/>
	)
}

type TabbedStoryViewProps = {
	loader: () => Promise<Record<string, unknown>>
	filePath: string
	componentName: string
	requestedExport: string | null
	basePath: string
}

function TabbedStoryView({ loader, filePath, componentName, requestedExport, basePath }: TabbedStoryViewProps) {
	const [module, setModule] = useState<Record<string, unknown> | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setLoading(true)
		setError(null)

		loader()
			.then((mod) => {
				setModule(mod)
			})
			.catch((err) => {
				setError(String(err))
			})
			.finally(() => {
				setLoading(false)
			})
	}, [loader])

	if (loading) {
		return (
			<div className={styles.loading}>
				<div className={styles.loadingSpinner} />
			</div>
		)
	}

	if (error || !module) {
		return (
			<div className={styles.placeholder}>
				<h1 className={styles.placeholderTitle}>Error loading story</h1>
				<p className={styles.placeholderText}>{error || "Unknown error"}</p>
			</div>
		)
	}

	const storyExports = extractStoryExports(module)

	if (storyExports.length === 0) {
		return (
			<div className={styles.placeholder}>
				<h1 className={styles.placeholderTitle}>{componentName}</h1>
				<p className={styles.placeholderText}>No stories found in this file.</p>
			</div>
		)
	}

	// Find the active story - either from URL or default to first
	const activeExportName = requestedExport || storyExports[0]?.name || ""
	const activeExport = storyExports.find((e) => e.name.toLowerCase() === activeExportName.toLowerCase())
	const activeStory = activeExport || storyExports[0]

	if (!activeStory) {
		return (
			<div className={styles.placeholder}>
				<h1 className={styles.placeholderTitle}>{componentName}</h1>
				<p className={styles.placeholderText}>No stories found.</p>
			</div>
		)
	}

	const title = componentName

	return (
		<div className={styles.tabbedView}>
			<StoryTabs exports={storyExports} activeStory={activeStory.name} basePath={basePath} filePath={filePath} />
			<StoryErrorBoundary key={activeStory.name}>
				<StoryViewer story={activeStory.story} storyType={activeStory.type} title={title} />
			</StoryErrorBoundary>
		</div>
	)
}

function AnimatedLogo({ className }: { className?: string }) {
	return <LogoAnimated className={className} />
}
