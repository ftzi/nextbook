"use client"

import type { ReactNode } from "react"
import type { Stories } from "../types"
import styles from "./nextbook-shell.module.css"
import { Sidebar } from "./sidebar"

type NextbookShellProps = {
	children: ReactNode
	stories: Stories
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
 * import { NextbookShell } from 'nextbook'
 * import { stories } from './stories'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <NextbookShell stories={stories}>
 *           {children}
 *         </NextbookShell>
 *       </body>
 *     </html>
 *   )
 * }
 */
export function NextbookShell({ children, stories, basePath = "/ui" }: NextbookShellProps) {
	return (
		<div className={styles.shell}>
			<Sidebar tree={stories.tree} basePath={basePath} />
			<main className={styles.main}>{children}</main>
		</div>
	)
}
