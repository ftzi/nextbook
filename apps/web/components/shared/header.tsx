"use client"

import { motion } from "framer-motion"
import { Github } from "lucide-react"
import Link from "next/link"
import { Container } from "@/components/shared/container"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { externalLinks } from "@/lib/public-routes"

export function Header() {
	return (
		<motion.header
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="fixed top-0 right-0 left-0 z-50 border-border/40 border-b bg-background/80 backdrop-blur-xl"
		>
			<Container>
				<nav className="flex h-16 items-center justify-between">
					<Link href="/" className="flex items-center">
						<Logo size="sm" />
					</Link>

					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" asChild>
							<a href="#features">Features</a>
						</Button>
						<Button variant="ghost" size="sm" asChild>
							<a href="#quickstart">Quick Start</a>
						</Button>
						<Button variant="ghost" size="icon" asChild>
							<a href={externalLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
								<Github className="size-5" />
							</a>
						</Button>
						<Button size="sm" asChild>
							<a href="#quickstart">Get Started</a>
						</Button>
					</div>
				</nav>
			</Container>
		</motion.header>
	)
}
