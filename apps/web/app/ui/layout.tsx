import "@/app/globals.css"
import type { Metadata } from "next"
import { NextbookShell } from "nextbook"
import { stories } from "./stories"

export const metadata: Metadata = {
	title: "Nextbook | Component Library",
	description: "Browse and interact with Nextbook's component library",
}

export default function NextbookLayout({ children }: { children: React.ReactNode }) {
	return <NextbookShell stories={stories}>{children}</NextbookShell>
}
