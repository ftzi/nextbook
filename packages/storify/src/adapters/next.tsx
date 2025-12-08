"use client"

import NextLink from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { LinkProps, RouterAdapter } from "../router-context"

/**
 * Next.js Link wrapper that conforms to StorifyLink interface.
 */
function NextLinkWrapper({ href, className, style, onClick, children, "data-active": dataActive }: LinkProps) {
	return (
		<NextLink href={href} className={className} style={style} onClick={onClick} data-active={dataActive}>
			{children}
		</NextLink>
	)
}

/**
 * Hook adapter for Next.js useRouter.
 */
function useNextRouter() {
	const router = useRouter()
	return {
		push: (href: string) => router.push(href),
	}
}

/**
 * Hook adapter for Next.js useSearchParams.
 */
function useNextSearchParams(): URLSearchParams {
	const searchParams = useSearchParams()
	return searchParams
}

/**
 * Router adapter for Next.js App Router.
 * Use this with RouterProvider when using Storify with Next.js.
 *
 * @example
 * import { RouterProvider } from '@ftzi/storify'
 * import { NextRouterAdapter } from '@ftzi/storify/next'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <RouterProvider adapter={NextRouterAdapter}>
 *       {children}
 *     </RouterProvider>
 *   )
 * }
 */
export const NextRouterAdapter: RouterAdapter = {
	Link: NextLinkWrapper,
	usePathname,
	useRouter: useNextRouter,
	useSearchParams: useNextSearchParams,
}
