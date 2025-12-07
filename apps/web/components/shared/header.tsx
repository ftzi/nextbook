"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { Logo } from "nextbook"
import { useState } from "react"
import { Container } from "@/components/shared/container"
import { LiveDemoButton } from "@/components/shared/live-demo-button"
import { Button } from "@/components/ui/button"
import { externalLinks } from "@/lib/public-routes"

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
						<Logo className="h-8 w-auto" />
					</Link>

					{/* Desktop navigation */}
					<div className="hidden items-center gap-1 md:flex">
						<Button variant="ghost" size="sm" asChild>
							<a href="#features">Features</a>
						</Button>
						<Button variant="ghost" size="sm" asChild>
							<a href="#comparison">Why Nextbook</a>
						</Button>
						<LiveDemoButton />
						<Button size="sm" asChild>
							<a href="#quickstart">
								Get Started
								<ArrowRight className="size-3.5" />
							</a>
						</Button>
						<a
							href={externalLinks.github}
							target="_blank"
							rel="noopener noreferrer"
							className="ml-2 text-muted-foreground transition-colors hover:text-foreground"
						>
							<svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
							<span className="sr-only">GitHub repository</span>
						</a>
					</div>

					{/* Mobile menu button */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
					</Button>
				</nav>
			</Container>

			{/* Mobile menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden border-border/40 border-t bg-background/95 backdrop-blur-xl md:hidden"
					>
						<Container>
							<div className="flex flex-col gap-2 py-4">
								<Button variant="ghost" size="sm" className="justify-start" asChild>
									{/* biome-ignore lint/a11y/useValidAnchor: hash link with menu close behavior */}
									<a href="#features" onClick={() => setMobileMenuOpen(false)}>
										Features
									</a>
								</Button>
								<Button variant="ghost" size="sm" className="justify-start" asChild>
									{/* biome-ignore lint/a11y/useValidAnchor: hash link with menu close behavior */}
									<a href="#comparison" onClick={() => setMobileMenuOpen(false)}>
										Why Nextbook
									</a>
								</Button>
								<LiveDemoButton onClick={() => setMobileMenuOpen(false)} />
								<Button variant="ghost" size="sm" className="justify-start" asChild>
									<a href={externalLinks.github} target="_blank" rel="noopener noreferrer">
										<svg viewBox="0 0 24 24" className="mr-1.5 size-4" fill="currentColor" aria-hidden="true">
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
										</svg>
										GitHub
									</a>
								</Button>
								<Button size="sm" className="w-fit" asChild>
									{/* biome-ignore lint/a11y/useValidAnchor: hash link with menu close behavior */}
									<a href="#quickstart" onClick={() => setMobileMenuOpen(false)}>
										Get Started
										<ArrowRight className="size-3.5" />
									</a>
								</Button>
							</div>
						</Container>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	)
}
