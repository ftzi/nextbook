import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
	title: "Nextbook Example",
	description: "Example app for Nextbook component stories",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
