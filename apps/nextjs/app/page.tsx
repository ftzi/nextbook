import { CodeDemoServer } from "@/components/landing/code-demo-server"
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
				<CodeDemoServer />
				<Comparison />
				<QuickStart />
				<CTA />
			</main>
			<Footer />
		</>
	)
}
