import { StoryPage } from "@ftzi/storify"
import { createFileRoute } from "@tanstack/react-router"
import { stories } from "../../stories"

export const Route = createFileRoute("/ui/")({
	component: UIIndex,
})

function UIIndex() {
	return <StoryPage stories={stories} path={[]} basePath="/ui" />
}
