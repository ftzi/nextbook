import type { Metadata } from "next"
import { env } from "@/lib/env"

/**
 * Default metadata values for SEO
 */
export const DEFAULT_METADATA = {
	title: "Storify - Zero-config component stories for React frameworks",
	description:
		"A lightweight Storybook alternative designed for React frameworks. Zero config, Zod-powered controls, automatic story matrix generation, and AI-ready API.",
}

/**
 * Default OpenGraph metadata shared across all pages.
 * Use with spread operator: { ...DEFAULT_OPENGRAPH, title: "...", description: "..." }
 */
export const DEFAULT_OPENGRAPH: Metadata["openGraph"] = {
	title: DEFAULT_METADATA.title,
	description: DEFAULT_METADATA.description,
	siteName: "Storify",
	url: env.NEXT_PUBLIC_URL,
	type: "website",
	locale: "en_US",
}

/**
 * Brand colors for OG images (matches logo gradient)
 */
export const brandColors = {
	cyan: "#06B6D4",
	indigo: "#4F46E5",
	purple: "#7C3AED",
	pink: "#EC4899",
	dark: "#0a0a0a",
	light: "#fafafa",
} as const
