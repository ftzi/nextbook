"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { StoryTreeNode } from "../types"
import LogoIcon from "./icons/icon"
import styles from "./sidebar.module.css"

type SidebarProps = {
	tree: StoryTreeNode[]
	basePath?: string
}

export function Sidebar({ tree, basePath = "/ui" }: SidebarProps) {
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
					<LogoIcon className={styles.logoIcon} />
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
					<TreeNodes nodes={filteredTree} basePath={basePath} depth={0} />
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
	basePath: string
	depth: number
	parentPath?: string[]
}

function TreeNodes({ nodes, basePath, depth, parentPath = [] }: TreeNodesProps) {
	return (
		<ul className={styles.treeList}>
			{nodes.map((node) => (
				<TreeNode key={node.segment} node={node} basePath={basePath} depth={depth} parentPath={parentPath} />
			))}
		</ul>
	)
}

type TreeNodeProps = {
	node: StoryTreeNode
	basePath: string
	depth: number
	parentPath: string[]
}

function TreeNode({ node, basePath, depth, parentPath }: TreeNodeProps) {
	const pathname = usePathname()
	const currentPath = [...parentPath, node.segment]
	const paddingLeft = depth * 12 + 8
	const pathPrefix = `${basePath}/${currentPath.join("/").toLowerCase()}`
	const isActiveOrAncestor = pathname.toLowerCase().startsWith(pathPrefix)

	// Directories start collapsed, but auto-expand if they contain the active item
	const [isOpen, setIsOpen] = useState(isActiveOrAncestor)

	// Auto-expand when navigation changes to a child
	useEffect(() => {
		if (isActiveOrAncestor && !isOpen) {
			setIsOpen(true)
		}
	}, [isActiveOrAncestor, isOpen])

	// Story file - render as a simple link
	if (node.filePath) {
		const href = `${basePath}/${node.filePath.toLowerCase()}`
		const isActive = pathname.toLowerCase().startsWith(href)

		return (
			<li>
				<Link
					href={href}
					className={`${styles.storyLink} ${isActive ? styles.storyLinkActive : ""}`}
					style={{ paddingLeft }}
				>
					<span>{node.name}</span>
					<ChevronRightIcon />
				</Link>
			</li>
		)
	}

	// Directory - render with expand/collapse
	if (node.children && node.children.length > 0) {
		return (
			<li>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className={`${styles.expandButton} ${isActiveOrAncestor ? styles.expandButtonActive : ""}`}
					style={{ paddingLeft }}
				>
					<ChevronIcon isOpen={isOpen} />
					{node.name}
				</button>
				{isOpen && <TreeNodes nodes={node.children} basePath={basePath} depth={depth + 1} parentPath={currentPath} />}
			</li>
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

function ChevronRightIcon() {
	return (
		<span className={styles.chevronRight}>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
				<path
					d="M4.5 2L8.5 6L4.5 10"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	)
}
