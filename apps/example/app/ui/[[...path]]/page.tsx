import { StoryPage } from "nextbook"
import { stories } from "../stories"

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await params
	return <StoryPage path={path} stories={stories} />
}
