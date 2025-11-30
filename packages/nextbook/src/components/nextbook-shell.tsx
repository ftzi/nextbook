"use client"

import Link from "next/link"
import { type ReactNode, useState } from "react"
import type { Stories } from "../types"
import Logo from "./icons/logo"
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
	const [sidebarOpen, setSidebarOpen] = useState(false)

	const closeSidebar = () => setSidebarOpen(false)

	return (
		<div className={styles.shell}>
			{/* Mobile header */}
			<div className={styles.mobileHeader}>
				<Link href={basePath} className={styles.mobileHeaderLogo}>
					<Logo className={styles.mobileHeaderLogoIcon} />
				</Link>
				<button
					type="button"
					className={styles.menuButton}
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-label={sidebarOpen ? "Close menu" : "Open menu"}
				>
					{sidebarOpen ? (
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					) : (
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					)}
				</button>
			</div>

			{/* Mobile overlay - dismisses sidebar when clicked */}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: overlay is a click target for dismissing the sidebar */}
			<div
				className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
				onClick={closeSidebar}
				onKeyDown={(e) => e.key === "Escape" && closeSidebar()}
				role="presentation"
			/>

			<Sidebar tree={stories.tree} basePath={basePath} isOpen={sidebarOpen} onLinkClick={closeSidebar} />
			<main className={styles.main}>{children}</main>
		</div>
	)
}
