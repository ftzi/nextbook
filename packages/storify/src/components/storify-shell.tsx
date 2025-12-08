"use client"

import { type ReactNode, useState } from "react"
import { MswProvider } from "../hooks/msw-context"
import { type RouterAdapter, RouterProvider, StorifyLink } from "../router-context"
import type { Stories } from "../types"
import Logo from "./icons/logo"
import { Sidebar } from "./sidebar"
import styles from "./storify-shell.module.css"

type StorifyShellProps = {
	children: ReactNode
	stories: Stories
	basePath?: string
	/** Router adapter for framework-specific routing. Required. */
	router: RouterAdapter
}

/**
 * Shell component that provides the Storify layout.
 * Includes the sidebar navigation and main content area.
 *
 * Must be wrapped in html/body tags in your layout file.
 *
 * @example
 * // Next.js: app/ui/layout.tsx
 * import { StorifyShell } from '@ftzi/storify'
 * import { NextRouterAdapter } from '@ftzi/storify/next'
 * import { stories } from './stories'
 *
 * export default function Layout({ children }) {
 *   return <StorifyShell stories={stories} router={NextRouterAdapter}>{children}</StorifyShell>
 * }
 *
 * @example
 * // TanStack Start: routes/ui.tsx
 * import { StorifyShell } from '@ftzi/storify'
 * import { TanStackRouterAdapter } from '@ftzi/storify/tanstack'
 * import { stories } from './stories'
 *
 * export default function Layout({ children }) {
 *   return <StorifyShell stories={stories} router={TanStackRouterAdapter}>{children}</StorifyShell>
 * }
 */
export function StorifyShell({ children, stories, basePath = "/ui", router }: StorifyShellProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	const closeSidebar = () => setSidebarOpen(false)

	return (
		<RouterProvider adapter={router}>
			<MswProvider>
				<div className={styles.shell}>
					{/* Mobile header */}
					<div className={styles.mobileHeader}>
						<StorifyLink href={basePath} className={styles.mobileHeaderLogo}>
							<Logo className={styles.mobileHeaderLogoIcon} />
						</StorifyLink>
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
			</MswProvider>
		</RouterProvider>
	)
}
