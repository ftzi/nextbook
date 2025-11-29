import { Github, Package } from "lucide-react"
import Link from "next/link"

import { Container } from "@/components/shared/container"
import { Logo } from "@/components/shared/logo"
import { externalLinks } from "@/lib/public-routes"

export function Footer() {
	return (
		<footer className="border-border/40 border-t bg-muted/30 py-12">
			<Container>
				<div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
					<div className="flex flex-col items-center gap-4 sm:items-start">
						<Link href="/">
							<Logo size="sm" />
						</Link>
						<p className="text-center text-muted-foreground text-sm sm:text-left">
							Zero-config component stories for Next.js
						</p>
					</div>

					<div className="flex items-center gap-6">
						<a
							href={externalLinks.github}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							<Github className="size-4" />
							<span>GitHub</span>
						</a>
						<a
							href={externalLinks.npm}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							<Package className="size-4" />
							<span>npm</span>
						</a>
					</div>
				</div>

				<div className="mt-8 border-border/40 border-t pt-8 text-center">
					<p className="text-muted-foreground text-xs">
						Built with Next.js. Open source on{" "}
						<a
							href={externalLinks.github}
							target="_blank"
							rel="noopener noreferrer"
							className="underline underline-offset-4 hover:text-foreground"
						>
							GitHub
						</a>
						.
					</p>
				</div>
			</Container>
		</footer>
	)
}
