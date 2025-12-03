import { ImageResponse } from "next/og"
import { Icon } from "nextbook"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function IconImage() {
	return new ImageResponse(<Icon width={32} height={32} />, size)
}
