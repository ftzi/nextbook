import "@/app/globals.css"
import { StorifyShell } from "@ftzi/storify"
import { NextRouterAdapter } from "@ftzi/storify/next"
import type { Metadata } from "next"
import { stories } from "./stories"

export const metadata: Metadata = {
	title: "Storify | Component Library",
	description: "Browse and interact with Storify's component library",
}

export default function StorifyLayout({ children }: { children: React.ReactNode }) {
	return (
		<StorifyShell stories={stories} router={NextRouterAdapter}>
			{children}
		</StorifyShell>
	)
}
