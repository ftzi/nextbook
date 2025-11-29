"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { isStory } from "../story"
import type { StoryTreeNode } from "../types"
import styles from "./sidebar.module.css"

type StoryLoaders = Record<string, () => Promise<Record<string, unknown>>>

type SidebarProps = {
	tree: StoryTreeNode[]
	loaders: StoryLoaders
	basePath?: string
}

export function Sidebar({ tree, loaders, basePath = "/ui" }: SidebarProps) {
	const [search, setSearch] = useState("")

	const filteredTree = useMemo(() => {
		if (!search.trim()) return tree
		return filterTree(tree, search.toLowerCase())
	}, [tree, search])

	return (
		<aside className={styles.sidebar}>
			{/* Header */}
			<div className={styles.header}>
				<Link href={basePath} className={styles.logo}>
					<svg className={styles.logoIcon} viewBox="-20 -20 440 440" aria-hidden="true">
						<defs>
							<linearGradient id="nb-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stopColor="#06B6D4" />
								<stop offset="50%" stopColor="#7C3AED" />
								<stop offset="100%" stopColor="#EC4899" />
							</linearGradient>
						</defs>
						<g transform="rotate(45 200 200)">
							<rect
								x="90"
								y="90"
								width="220"
								height="220"
								fill="none"
								stroke="url(#nb-logo-gradient)"
								strokeWidth="70"
							/>
						</g>
					</svg>
					Nextbook
				</Link>
				<a
					href="https://github.com/ftzi/nextbook"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.githubLink}
				>
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					<span className={styles.srOnly}>View on GitHub</span>
				</a>
			</div>

			{/* Search */}
			<div className={styles.searchContainer}>
				<div className={styles.searchWrapper}>
					<svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path
							fillRule="evenodd"
							d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
							clipRule="evenodd"
						/>
					</svg>
					<input
						type="text"
						placeholder="Search stories..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={styles.searchInput}
					/>
				</div>
			</div>

			{/* Tree */}
			<nav className={styles.nav}>
				{filteredTree.length > 0 ? (
					<TreeNodes nodes={filteredTree} loaders={loaders} basePath={basePath} depth={0} />
				) : (
					<p className={styles.emptyMessage}>No stories found</p>
				)}
			</nav>
		</aside>
	)
}

function filterTree(nodes: StoryTreeNode[], query: string): StoryTreeNode[] {
	const result: StoryTreeNode[] = []

	for (const node of nodes) {
		const nameMatches = node.name.toLowerCase().includes(query)

		if (node.children && node.children.length > 0) {
			const filteredChildren = filterTree(node.children, query)
			if (filteredChildren.length > 0 || nameMatches) {
				result.push({
					...node,
					children: filteredChildren.length > 0 ? filteredChildren : node.children,
				})
			}
		} else if (nameMatches) {
			result.push(node)
		}
	}

	return result
}

type TreeNodesProps = {
	nodes: StoryTreeNode[]
	loaders: StoryLoaders
	basePath: string
	depth: number
	parentPath?: string[]
}

function TreeNodes({ nodes, loaders, basePath, depth, parentPath = [] }: TreeNodesProps) {
	return (
		<ul className={styles.treeList}>
			{nodes.map((node) => (
				<TreeNode
					key={node.segment}
					node={node}
					loaders={loaders}
					basePath={basePath}
					depth={depth}
					parentPath={parentPath}
				/>
			))}
		</ul>
	)
}

type TreeNodeProps = {
	node: StoryTreeNode
	loaders: StoryLoaders
	basePath: string
	depth: number
	parentPath: string[]
}

function TreeNode({ node, loaders, basePath, depth, parentPath }: TreeNodeProps) {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(true)
	const currentPath = [...parentPath, node.segment]
	const paddingLeft = depth * 12 + 8
	const pathPrefix = `${basePath}/${currentPath.join("/").toLowerCase()}`
	const isAncestorOfActive = pathname.toLowerCase().startsWith(pathPrefix)

	if (node.filePath) {
		return (
			<StoryFileNode
				node={node}
				loaders={loaders}
				basePath={basePath}
				currentPath={currentPath}
				paddingLeft={paddingLeft}
				isAncestorOfActive={isAncestorOfActive}
				isOpen={isOpen}
				onToggle={() => setIsOpen(!isOpen)}
			/>
		)
	}

	if (node.children && node.children.length > 0) {
		return (
			<DirectoryNode
				node={node}
				loaders={loaders}
				basePath={basePath}
				depth={depth}
				currentPath={currentPath}
				paddingLeft={paddingLeft}
				isAncestorOfActive={isAncestorOfActive}
				isOpen={isOpen}
				onToggle={() => setIsOpen(!isOpen)}
			/>
		)
	}

	return null
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
	return (
		<span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
				<path
					d="M4.5 2L8.5 6L4.5 10"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	)
}

function ExpandButton({
	isOpen,
	isActive,
	onClick,
	name,
	paddingLeft,
}: {
	isOpen: boolean
	isActive: boolean
	onClick: () => void
	name: string
	paddingLeft: number
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`${styles.expandButton} ${isActive ? styles.expandButtonActive : ""}`}
			style={{ paddingLeft }}
		>
			<ChevronIcon isOpen={isOpen} />
			{name}
		</button>
	)
}

function StoryFileNode({
	node,
	loaders,
	basePath,
	currentPath,
	paddingLeft,
	isAncestorOfActive,
	isOpen,
	onToggle,
}: {
	node: StoryTreeNode
	loaders: StoryLoaders
	basePath: string
	currentPath: string[]
	paddingLeft: number
	isAncestorOfActive: boolean
	isOpen: boolean
	onToggle: () => void
}) {
	const pathname = usePathname()
	const [exports, setExports] = useState<string[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (isOpen && exports.length === 0 && node.filePath) {
			const loader = loaders[node.filePath]
			if (loader) {
				setLoading(true)
				loader()
					.then((mod) => {
						const storyExports = Object.entries(mod)
							.filter(([, value]) => isStory(value))
							.map(([name]) => name)
						setExports(storyExports)
					})
					.catch((err) => {
						console.error("[nextbook] Failed to load exports:", err)
					})
					.finally(() => {
						setLoading(false)
					})
			}
		}
	}, [isOpen, exports.length, node.filePath, loaders])

	return (
		<li>
			<ExpandButton
				isOpen={isOpen}
				isActive={isAncestorOfActive}
				onClick={onToggle}
				name={node.name}
				paddingLeft={paddingLeft}
			/>
			{isOpen && (
				<ExportsList
					exports={exports}
					loading={loading}
					basePath={basePath}
					currentPath={currentPath}
					paddingLeft={paddingLeft + 20}
					pathname={pathname}
				/>
			)}
		</li>
	)
}

function ExportsList({
	exports,
	loading,
	basePath,
	currentPath,
	paddingLeft,
	pathname,
}: {
	exports: string[]
	loading: boolean
	basePath: string
	currentPath: string[]
	paddingLeft: number
	pathname: string
}) {
	if (loading) {
		return (
			<ul className={styles.treeList}>
				<li className={styles.loadingText} style={{ paddingLeft }}>
					Loading...
				</li>
			</ul>
		)
	}

	if (exports.length === 0) {
		return (
			<ul className={styles.treeList}>
				<li className={styles.noStories} style={{ paddingLeft }}>
					No stories
				</li>
			</ul>
		)
	}

	return (
		<ul className={styles.treeList}>
			{exports.map((exportName) => {
				const url = `${basePath}/${currentPath.join("/")}/${exportName}`.toLowerCase()
				const isActive = pathname.toLowerCase() === url
				return (
					<li key={exportName}>
						<Link
							href={url}
							className={`${styles.storyLink} ${isActive ? styles.storyLinkActive : ""}`}
							style={{ paddingLeft }}
						>
							{exportName}
						</Link>
					</li>
				)
			})}
		</ul>
	)
}

function DirectoryNode({
	node,
	loaders,
	basePath,
	depth,
	currentPath,
	paddingLeft,
	isAncestorOfActive,
	isOpen,
	onToggle,
}: {
	node: StoryTreeNode
	loaders: StoryLoaders
	basePath: string
	depth: number
	currentPath: string[]
	paddingLeft: number
	isAncestorOfActive: boolean
	isOpen: boolean
	onToggle: () => void
}) {
	return (
		<li>
			<ExpandButton
				isOpen={isOpen}
				isActive={isAncestorOfActive}
				onClick={onToggle}
				name={node.name}
				paddingLeft={paddingLeft}
			/>
			{isOpen && node.children && (
				<TreeNodes
					nodes={node.children}
					loaders={loaders}
					basePath={basePath}
					depth={depth + 1}
					parentPath={currentPath}
				/>
			)}
		</li>
	)
}
