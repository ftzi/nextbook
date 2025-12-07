import type { MetadataRoute } from "next"
import { env } from "@/lib/env"
import { publicPaths } from "@/lib/public-routes"

/**
 * Generates the sitemap.xml for search engines.
 * Access at: https://storify.dev/sitemap.xml
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return publicPaths.map((route) => ({
		url: new URL(route.href, env.NEXT_PUBLIC_URL).href,
		changeFrequency: route.changeFrequency,
		priority: route.priority,
		lastModified: new Date(),
	}))
}
