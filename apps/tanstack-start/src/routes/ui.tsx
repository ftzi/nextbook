import { StorifyShell } from "@ftzi/storify"
import { TanStackRouterAdapter } from "@ftzi/storify/tanstack"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { stories } from "../stories"

export const Route = createFileRoute("/ui")({
	component: UILayout,
})

function UILayout() {
	return (
		<StorifyShell stories={stories} router={TanStackRouterAdapter}>
			<Outlet />
		</StorifyShell>
	)
}
