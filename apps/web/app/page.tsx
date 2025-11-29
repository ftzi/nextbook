import { CodeDemo } from "@/components/landing/code-demo"
import { Comparison } from "@/components/landing/comparison"
import { CTA } from "@/components/landing/cta"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { QuickStart } from "@/components/landing/quick-start"
import { Footer } from "@/components/shared/footer"
import { Header } from "@/components/shared/header"

export default function HomePage() {
	return (
		<>
			<Header />
			<main>
				<Hero />
				<Features />
				<CodeDemo />
				<Comparison />
				<QuickStart />
				<CTA />
			</main>
			<Footer />
		</>
	)
}
