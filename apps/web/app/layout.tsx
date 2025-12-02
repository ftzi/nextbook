import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { env } from "@/lib/env"

const fontSans = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
})

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
})

export const metadata: Metadata = {
	title: {
		default: "Nextbook - Zero-config component stories for Next.js",
		template: "%s | Nextbook",
	},
	description:
		"A lightweight Storybook alternative designed for Next.js. Zero config, Zod-powered controls, automatic story matrix generation, and AI-ready API.",
	applicationName: "Nextbook",
	metadataBase: new URL(env.NEXT_PUBLIC_URL),
	keywords: [
		"nextbook",
		"storybook",
		"next.js",
		"react",
		"component stories",
		"ui components",
		"design system",
		"zod",
		"typescript",
	],
	authors: [{ name: "ftzi" }],
	creator: "ftzi",
	openGraph: {
		title: "Nextbook - Zero-config component stories for Next.js",
		description:
			"A lightweight Storybook alternative designed for Next.js. Zero config, Zod-powered controls, automatic story matrix generation.",
		siteName: "Nextbook",
		url: env.NEXT_PUBLIC_URL,
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Nextbook - Zero-config component stories for Next.js",
		description:
			"A lightweight Storybook alternative designed for Next.js. Zero config, Zod-powered controls, automatic story matrix generation.",
	},
	icons: {
		icon: "/api/icon",
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
	return (
		<html lang="en" className="dark">
			<body className={`${fontSans.variable} ${fontMono.variable} min-h-screen antialiased`}>
				{children}
				<Analytics />
			</body>
		</html>
	)
}
