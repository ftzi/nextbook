import Link from "next/link"

export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-8">
			<h1 className="mb-4 font-bold text-4xl">Nextbook Example</h1>
			<p className="mb-8 text-gray-600">This is an example app demonstrating Nextbook component stories.</p>
			<Link href="/ui" className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
				View Component Stories
			</Link>
		</main>
	)
}
