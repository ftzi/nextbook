import type { MetadataRoute } from "next"
import { env } from "@/lib/env"

/**
 * Generates robots.txt for search engine crawlers.
 * Access at: https://nextbook.dev/robots.txt
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: new URL("sitemap.xml", env.NEXT_PUBLIC_URL).href,
		host: env.NEXT_PUBLIC_URL,
	}
}
