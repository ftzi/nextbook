import { StoryPage } from "@ftzi/storify"
import { createFileRoute } from "@tanstack/react-router"
import { stories } from "../../stories"

export const Route = createFileRoute("/ui/$")({
	component: StoryRoute,
})

function StoryRoute() {
	const { _splat } = Route.useParams()
	const path = _splat ? _splat.split("/").filter(Boolean) : []

	return <StoryPage stories={stories} path={path} basePath="/ui" />
}
