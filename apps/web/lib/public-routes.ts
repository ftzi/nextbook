import type { MetadataRoute } from "next"

export type Href = `/${string}` | "/"

export type Nav = {
	label: string
	href: Href
}

type SitemapRoute = Nav & Omit<MetadataRoute.Sitemap[number], "url"> & { noSitemap?: false }

type NoSitemapRoute = Nav & { noSitemap: true }

type PublicRoute = SitemapRoute | NoSitemapRoute

/**
 * Centralized route definitions for:
 * 1. sitemap.ts - SEO sitemap generation
 * 2. Header/Footer navigation links
 * 3. Future: middleware for protected routes
 */
export const publicRoutes = {
	home: {
		label: "Home",
		href: "/",
		changeFrequency: "weekly",
		priority: 1,
	},
} satisfies Record<string, PublicRoute>

export type PublicPath = (typeof publicRoutes)[keyof typeof publicRoutes]["href"]

function isSitemapRoute(route: PublicRoute): route is SitemapRoute {
	return !("noSitemap" in route && route.noSitemap)
}

/** Routes for sitemap (excludes URL fragments like /#features and noSitemap routes). */
export const publicPaths = Object.values(publicRoutes as Record<string, PublicRoute>).filter(
	(route): route is SitemapRoute => !route.href.includes("#") && isSitemapRoute(route),
)

/** External links */
export const externalLinks = {
	github: "https://github.com/ftzi/nextbook",
	npm: "https://www.npmjs.com/package/nextbook",
} as const
