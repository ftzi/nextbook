"use client"

import { Component, type ReactNode } from "react"
import type { StoryTreeNode } from "../types"
import styles from "./story-page.module.css"
import { StoryViewer } from "./story-viewer"

type StoryLoaders = Record<string, () => Promise<Record<string, unknown>>>

type StoryPageProps = {
	path: string[]
	storyTree: StoryTreeNode[]
	loaders: StoryLoaders
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
 * Client component for rendering stories.
 * Handles the welcome page, story lookup, and lazy loading.
 */
export function StoryPage({ path, storyTree, loaders }: StoryPageProps) {
	// Welcome page
	if (path.length === 0) {
		const storyCount = countStoryFiles(storyTree)
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
	const result = findStoryFile(storyTree, path)

	if (!result) {
		// Maybe it's a directory node
		const dirNode = findNodeByPath(storyTree, path)
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

	// Story file without export specified - prompt to select variant
	if (!exportName) {
		return (
			<div className={styles.placeholder}>
				<h1 className={styles.placeholderTitle}>{node.name}</h1>
				<p className={styles.placeholderText}>Select a story variant from the sidebar.</p>
			</div>
		)
	}

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

	const title = path.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ")

	return (
		<StoryErrorBoundary key={path.join("/")}>
			<StoryViewer loader={loader} exportName={exportName} title={title} />
		</StoryErrorBoundary>
	)
}

function AnimatedLogo({ className }: { className?: string }) {
	return (
		<svg viewBox="-60 -60 3000 520" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
			<defs>
				<linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style={{ stopColor: "#06B6D4", stopOpacity: 1 }} />
					<stop offset="50%" style={{ stopColor: "#7C3AED", stopOpacity: 1 }} />
					<stop offset="100%" style={{ stopColor: "#EC4899", stopOpacity: 1 }} />
				</linearGradient>
				<linearGradient id="nextGradient" x1="420" y1="0" x2="1580" y2="0" gradientUnits="userSpaceOnUse">
					<stop offset="0%" style={{ stopColor: "#06B6D4", stopOpacity: 1 }} />
					<stop offset="100%" style={{ stopColor: "#4F46E5", stopOpacity: 1 }} />
				</linearGradient>
				<linearGradient id="bookGradient" x1="0" y1="0" x2="1220" y2="0" gradientUnits="userSpaceOnUse">
					<stop offset="0%" style={{ stopColor: "#4F46E5", stopOpacity: 1 }} />
					<stop offset="50%" style={{ stopColor: "#7C3AED", stopOpacity: 1 }} />
					<stop offset="100%" style={{ stopColor: "#EC4899", stopOpacity: 1 }} />
				</linearGradient>
				<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="6" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="3" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<filter id="mirageB" x="-50%" y="-50%" width="200%" height="200%">
					<feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves={2} result="turbulence" seed={5}>
						<animate
							attributeName="baseFrequency"
							values="0.006 0.04;0.008 0.05;0.006 0.04"
							dur="12s"
							repeatCount="indefinite"
						/>
					</feTurbulence>
					<feDisplacementMap
						in="SourceGraphic"
						in2="turbulence"
						scale={4}
						xChannelSelector="R"
						yChannelSelector="G"
						result="displaced"
					>
						<animate attributeName="scale" values="2;5;2" dur="10s" repeatCount="indefinite" />
					</feDisplacementMap>
					<feGaussianBlur in="displaced" stdDeviation="3" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="displaced" />
					</feMerge>
				</filter>
				<filter id="mirageO1" x="-50%" y="-50%" width="200%" height="200%">
					<feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves={2} result="turbulence" seed={7}>
						<animate
							attributeName="baseFrequency"
							values="0.006 0.04;0.008 0.05;0.006 0.04"
							dur="12s"
							repeatCount="indefinite"
						/>
					</feTurbulence>
					<feDisplacementMap
						in="SourceGraphic"
						in2="turbulence"
						scale={7}
						xChannelSelector="R"
						yChannelSelector="G"
						result="displaced"
					>
						<animate attributeName="scale" values="4;9;4" dur="10s" repeatCount="indefinite" />
					</feDisplacementMap>
					<feGaussianBlur in="displaced" stdDeviation="3" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="displaced" />
					</feMerge>
				</filter>
				<filter id="mirageO2" x="-50%" y="-50%" width="200%" height="200%">
					<feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves={2} result="turbulence" seed={11}>
						<animate
							attributeName="baseFrequency"
							values="0.006 0.04;0.008 0.05;0.006 0.04"
							dur="12s"
							repeatCount="indefinite"
						/>
					</feTurbulence>
					<feDisplacementMap
						in="SourceGraphic"
						in2="turbulence"
						scale={10}
						xChannelSelector="R"
						yChannelSelector="G"
						result="displaced"
					>
						<animate attributeName="scale" values="7;13;7" dur="10s" repeatCount="indefinite" />
					</feDisplacementMap>
					<feGaussianBlur in="displaced" stdDeviation="3" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="displaced" />
					</feMerge>
				</filter>
				<filter id="mirageK" x="-50%" y="-50%" width="200%" height="200%">
					<feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves={2} result="turbulence" seed={13}>
						<animate
							attributeName="baseFrequency"
							values="0.006 0.04;0.008 0.05;0.006 0.04"
							dur="12s"
							repeatCount="indefinite"
						/>
					</feTurbulence>
					<feDisplacementMap
						in="SourceGraphic"
						in2="turbulence"
						scale={13}
						xChannelSelector="R"
						yChannelSelector="G"
						result="displaced"
					>
						<animate attributeName="scale" values="10;16;10" dur="10s" repeatCount="indefinite" />
					</feDisplacementMap>
					<feGaussianBlur in="displaced" stdDeviation="3" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="displaced" />
					</feMerge>
				</filter>
			</defs>
			<g transform="rotate(45 200 200)">
				<rect
					x="90"
					y="90"
					width="220"
					height="220"
					fill="none"
					stroke="url(#outerGradient)"
					strokeWidth="70"
					filter="url(#glow)"
					opacity="0.9"
				/>
			</g>
			<text
				x="420"
				y="245"
				fontFamily="'Helvetica Neue'"
				fontSize="550"
				fontWeight="700"
				letterSpacing="-16"
				filter="url(#textGlow)"
				opacity="0.9"
				dominantBaseline="middle"
			>
				<tspan fill="url(#nextGradient)" stroke="url(#nextGradient)" strokeWidth="11">
					Next
				</tspan>
			</text>
			<g transform="translate(1580, 0)">
				<text
					x="0"
					y="245"
					fontFamily="'Helvetica Neue'"
					fontSize="550"
					fontWeight="700"
					letterSpacing="-16"
					filter="url(#mirageB)"
					opacity="0.9"
					dominantBaseline="middle"
					fill="none"
					stroke="url(#bookGradient)"
					strokeWidth="11"
				>
					b
				</text>
				<text
					x="300"
					y="245"
					fontFamily="'Helvetica Neue'"
					fontSize="550"
					fontWeight="700"
					letterSpacing="-16"
					filter="url(#mirageO1)"
					opacity="0.9"
					dominantBaseline="middle"
					fill="none"
					stroke="url(#bookGradient)"
					strokeWidth="11"
				>
					o
				</text>
				<text
					x="600"
					y="245"
					fontFamily="'Helvetica Neue'"
					fontSize="550"
					fontWeight="700"
					letterSpacing="-16"
					filter="url(#mirageO2)"
					opacity="0.9"
					dominantBaseline="middle"
					fill="none"
					stroke="url(#bookGradient)"
					strokeWidth="11"
				>
					o
				</text>
				<text
					x="900"
					y="245"
					fontFamily="'Helvetica Neue'"
					fontSize="550"
					fontWeight="700"
					letterSpacing="-16"
					filter="url(#mirageK)"
					opacity="0.9"
					dominantBaseline="middle"
					fill="none"
					stroke="url(#bookGradient)"
					strokeWidth="11"
				>
					k
				</text>
			</g>
		</svg>
	)
}
