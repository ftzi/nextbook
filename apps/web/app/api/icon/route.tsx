import { ImageResponse } from "next/og"
import { Icon } from "nextbook"

export const revalidate = 3600

const ICON_SIZE = {
	width: 32,
	height: 32,
}

export const GET = () => new ImageResponse(<Icon width={32} height={32} />, ICON_SIZE)

export const contentType = "image/png"
