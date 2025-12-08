"use client"

import { Link, useRouter, useRouterState, useSearch } from "@tanstack/react-router"
import type { LinkProps, RouterAdapter } from "../router-context"

/**
 * TanStack Router Link wrapper that conforms to StorifyLink interface.
 */
function TanStackLinkWrapper({ href, className, style, onClick, children, "data-active": dataActive }: LinkProps) {
	return (
		<Link to={href} className={className} style={style} onClick={onClick} data-active={dataActive}>
			{children}
		</Link>
	)
}

/**
 * Hook adapter for TanStack Router pathname.
 */
function useTanStackPathname(): string {
	const routerState = useRouterState()
	return routerState.location.pathname
}

/**
 * Hook adapter for TanStack Router push navigation.
 */
function useTanStackRouter() {
	const router = useRouter()
	return {
		push: (href: string) => router.navigate({ to: href }),
	}
}

/**
 * Hook adapter for TanStack Router search params.
 */
function useTanStackSearchParams(): URLSearchParams {
	const search = useSearch({ strict: false })
	return new URLSearchParams(search as Record<string, string>)
}

/**
 * Router adapter for TanStack Router / TanStack Start.
 * Use this with RouterProvider when using Storify with TanStack Start.
 *
 * @example
 * import { RouterProvider } from '@ftzi/storify'
 * import { TanStackRouterAdapter } from '@ftzi/storify/tanstack'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <RouterProvider adapter={TanStackRouterAdapter}>
 *       {children}
 *     </RouterProvider>
 *   )
 * }
 */
export const TanStackRouterAdapter: RouterAdapter = {
	Link: TanStackLinkWrapper,
	usePathname: useTanStackPathname,
	useRouter: useTanStackRouter,
	useSearchParams: useTanStackSearchParams,
}
