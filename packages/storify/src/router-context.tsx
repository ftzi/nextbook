"use client"

import { type ComponentType, createContext, type ReactNode, useContext } from "react"

/**
 * Link component props - framework-agnostic interface for navigation links.
 */
export type LinkProps = {
	href: string
	className?: string
	style?: React.CSSProperties
	onClick?: () => void
	children: ReactNode
	"data-active"?: boolean
}

/**
 * Router adapter interface that frameworks must implement.
 * This abstracts away the framework-specific routing APIs.
 */
export type RouterAdapter = {
	/** Link component for client-side navigation */
	Link: ComponentType<LinkProps>
	/** Hook to get current pathname */
	usePathname: () => string
	/** Hook to get router with push method for programmatic navigation */
	useRouter: () => { push: (href: string) => void }
	/** Hook to get current search params */
	useSearchParams: () => URLSearchParams
}

const RouterContext = createContext<RouterAdapter | null>(null)

/**
 * Provider component that supplies the router adapter to Storify components.
 */
export function RouterProvider({ adapter, children }: { adapter: RouterAdapter; children: ReactNode }) {
	return <RouterContext.Provider value={adapter}>{children}</RouterContext.Provider>
}

/**
 * Hook to access the router adapter. Throws if used outside RouterProvider.
 */
export function useRouterAdapter(): RouterAdapter {
	const adapter = useContext(RouterContext)
	if (!adapter) {
		throw new Error(
			"[storify] RouterProvider not found. Make sure to wrap your app with a router adapter.\n" +
				"For Next.js: import { NextRouterAdapter } from '@ftzi/storify/next'\n" +
				"For TanStack: import { TanStackRouterAdapter } from '@ftzi/storify/tanstack'",
		)
	}
	return adapter
}

/**
 * Framework-agnostic Link component that uses the router adapter.
 */
export function StorifyLink(props: LinkProps) {
	const { Link } = useRouterAdapter()
	return <Link {...props} />
}
