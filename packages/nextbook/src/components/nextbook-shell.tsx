"use client"

import type { ReactNode } from "react"
import type { StoryTreeNode } from "../types"
import styles from "./nextbook-shell.module.css"
import { Sidebar } from "./sidebar"

type StoryLoaders = Record<string, () => Promise<Record<string, unknown>>>

type NextbookShellProps = {
	children: ReactNode
	tree: StoryTreeNode[]
	loaders: StoryLoaders
	basePath?: string
}

/**
 * Shell component that provides the Nextbook layout.
 * Includes the sidebar navigation and main content area.
 *
 * Must be wrapped in html/body tags in your layout file.
 *
 * @example
 * // app/ui/layout.tsx
 * import { NextbookShell } from '@workspace/nextbook'
 * import { storyTree, loaders } from './stories'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <NextbookShell tree={storyTree} loaders={loaders}>
 *           {children}
 *         </NextbookShell>
 *       </body>
 *     </html>
 *   )
 * }
 */
export function NextbookShell({ children, tree, loaders, basePath = "/ui" }: NextbookShellProps) {
	return (
		<div className={styles.shell}>
			<Sidebar tree={tree} loaders={loaders} basePath={basePath} />
			<main className={styles.main}>{children}</main>
		</div>
	)
}
