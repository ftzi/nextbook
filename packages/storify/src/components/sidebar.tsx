"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { StoryTreeNode } from "../types"
import { GitHubIcon } from "./icons/github"
import { ChevronRight, ChevronsDownUp, Component, Folder, FolderOpen, Search } from "./icons/icons"
import Logo from "./icons/logo"
import styles from "./sidebar.module.css"
import { Tooltip } from "./tooltip"

// Context to trigger collapse all from parent
const CollapseContext = createContext<number>(0)

type SidebarProps = {
	tree: StoryTreeNode[]
	basePath?: string
	isOpen?: boolean
	onLinkClick?: () => void
}

export function Sidebar({ tree, basePath = "/ui", isOpen = false, onLinkClick }: SidebarProps) {
	const [search, setSearch] = useState("")
	const [collapseSignal, setCollapseSignal] = useState(0)

	const filteredTree = useMemo(() => {
		if (!search.trim()) return tree
		return filterTree(tree, search.toLowerCase())
	}, [tree, search])

	const totalCount = useMemo(() => countStories(tree), [tree])
	const filteredCount = useMemo(() => countStories(filteredTree), [filteredTree])

	const sidebarClassName = `${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`

	const handleCollapseAll = () => {
		setCollapseSignal((prev) => prev + 1)
	}

	return (
		<CollapseContext.Provider value={collapseSignal}>
			<aside className={sidebarClassName}>
				{/* Header */}
				<div className={styles.header}>
					<Link href={basePath} className={styles.logo}>
						<Logo className={styles.logoIcon} />
					</Link>
					<Tooltip content="View on GitHub">
						<a
							href="https://github.com/ftzi/storify"
							target="_blank"
							rel="noopener noreferrer"
							className={styles.githubLink}
							aria-label="View on GitHub"
						>
							<GitHubIcon className={styles.githubIcon} />
						</a>
					</Tooltip>
				</div>

				{/* Search */}
				<div className={styles.searchContainer}>
					<div className={styles.searchWrapper}>
						<Search size={14} className={styles.searchIcon} aria-hidden="true" />
						<input
							type="text"
							placeholder="Search stories..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className={styles.searchInput}
						/>
						<span className={styles.storyCount}>{search ? `${filteredCount}/${totalCount}` : totalCount}</span>
					</div>
					<Tooltip content="Collapse all">
						<button
							type="button"
							onClick={handleCollapseAll}
							className={styles.collapseButton}
							aria-label="Collapse all folders"
						>
							<ChevronsDownUp size={14} />
						</button>
					</Tooltip>
				</div>

				{/* Tree */}
				<nav className={styles.nav}>
					{filteredTree.length > 0 ? (
						<TreeNodes nodes={filteredTree} basePath={basePath} depth={0} onLinkClick={onLinkClick} />
					) : (
						<p className={styles.emptyMessage}>No stories found</p>
					)}
				</nav>
			</aside>
		</CollapseContext.Provider>
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

function countStories(nodes: StoryTreeNode[]): number {
	let count = 0
	for (const node of nodes) {
		if (node.filePath) {
			count++
		} else if (node.children) {
			count += countStories(node.children)
		}
	}
	return count
}

type TreeNodesProps = {
	nodes: StoryTreeNode[]
	basePath: string
	depth: number
	parentPath?: string[]
	onLinkClick?: () => void
}

function sortNodes(nodes: StoryTreeNode[]): StoryTreeNode[] {
	return [...nodes].sort((a, b) => {
		const aIsFolder = Boolean(a.children && a.children.length > 0)
		const bIsFolder = Boolean(b.children && b.children.length > 0)
		// Folders first, then alphabetically
		if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1
		return a.name.localeCompare(b.name)
	})
}

function TreeNodes({ nodes, basePath, depth, parentPath = [], onLinkClick }: TreeNodesProps) {
	const sortedNodes = sortNodes(nodes)
	return (
		<ul className={styles.treeList}>
			{sortedNodes.map((node) => (
				<TreeNode
					key={node.segment}
					node={node}
					basePath={basePath}
					depth={depth}
					parentPath={parentPath}
					onLinkClick={onLinkClick}
				/>
			))}
		</ul>
	)
}

type TreeNodeProps = {
	node: StoryTreeNode
	basePath: string
	depth: number
	parentPath: string[]
	onLinkClick?: () => void
}

function TreeNode({ node, basePath, depth, parentPath, onLinkClick }: TreeNodeProps) {
	const pathname = usePathname()
	const collapseSignal = useContext(CollapseContext)
	const currentPath = [...parentPath, node.segment]
	const paddingLeft = depth * 12 + 8
	const pathPrefix = `${basePath}/${currentPath.join("/").toLowerCase()}`
	const isActiveOrAncestor = pathname.toLowerCase().startsWith(pathPrefix)

	// Directories start collapsed, but auto-expand if they contain the active item
	const [isOpen, setIsOpen] = useState(isActiveOrAncestor)

	// Collapse when signal changes (skip initial mount)
	useEffect(() => {
		if (collapseSignal > 0) {
			setIsOpen(false)
		}
	}, [collapseSignal])

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
					onClick={onLinkClick}
				>
					<span className={styles.chevronSpacer} aria-hidden="true" />
					<Component size={14} className={styles.storyIcon} color="#a5b4fc" aria-hidden="true" />
					<span className={styles.storyName}>{node.name}</span>
					<ChevronRight size={12} className={styles.chevronRight} aria-hidden="true" />
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
					<ChevronRight
						size={12}
						className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
						aria-hidden="true"
					/>
					{isOpen ? (
						<FolderOpen size={14} className={styles.folderIcon} color="#f59e0b" aria-hidden="true" />
					) : (
						<Folder size={14} className={styles.folderIcon} color="#f59e0b" aria-hidden="true" />
					)}
					{node.name}
				</button>
				{isOpen && (
					<div
						className={styles.childrenContainer}
						style={{ "--indent": `${paddingLeft + 6}px` } as React.CSSProperties}
					>
						<TreeNodes
							nodes={node.children}
							basePath={basePath}
							depth={depth + 1}
							parentPath={currentPath}
							onLinkClick={onLinkClick}
						/>
					</div>
				)}
			</li>
		)
	}

	return null
}
