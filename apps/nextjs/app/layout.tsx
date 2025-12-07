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
		default: "Storify - Zero-config component stories for React frameworks",
		template: "%s | Storify",
	},
	description:
		"A lightweight Storybook alternative designed for React frameworks. Zero config, Zod-powered controls, automatic story matrix generation, and AI-ready API.",
	applicationName: "Storify",
	metadataBase: new URL(env.NEXT_PUBLIC_URL),
	keywords: [
		"storify",
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
		title: "Storify - Zero-config component stories for React frameworks",
		description:
			"A lightweight Storybook alternative designed for React frameworks. Zero config, Zod-powered controls, automatic story matrix generation.",
		siteName: "Storify",
		url: env.NEXT_PUBLIC_URL,
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Storify - Zero-config component stories for React frameworks",
		description:
			"A lightweight Storybook alternative designed for React frameworks. Zero config, Zod-powered controls, automatic story matrix generation.",
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
