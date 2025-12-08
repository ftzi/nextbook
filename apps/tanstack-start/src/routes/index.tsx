import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
	component: HomePage,
})

function HomePage() {
	return (
		<div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
			<h1>TanStack Start App</h1>
			<p>This is a demo app using TanStack Start.</p>
		</div>
	)
}
