import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,
	})

	return router
}

declare module "@tanstack/react-router" {
	// biome-ignore lint/style/useConsistentTypeDefinitions: TanStack Router requires interface augmentation
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
