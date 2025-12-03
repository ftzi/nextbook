import { useCallback, useEffect, useState } from "react"

type VirtualItem = {
	index: number
	key: number
	start: number
	size: number
}

type UseVirtualizerOptions = {
	count: number
	getScrollElement: () => HTMLElement | null
	estimateSize: () => number
	overscan?: number
}

type Virtualizer = {
	getVirtualItems: () => VirtualItem[]
	getTotalSize: () => number
}

export function useVirtualizer({
	count,
	getScrollElement,
	estimateSize,
	overscan = 2,
}: UseVirtualizerOptions): Virtualizer {
	const [scrollTop, setScrollTop] = useState(0)
	const [containerHeight, setContainerHeight] = useState(0)

	const itemSize = estimateSize()
	const totalSize = count * itemSize

	// Set up scroll listener
	useEffect(() => {
		const element = getScrollElement()
		if (!element) return

		const handleScroll = () => {
			setScrollTop(element.scrollTop)
		}

		const handleResize = () => {
			setContainerHeight(element.clientHeight)
		}

		// Initial measurements
		setScrollTop(element.scrollTop)
		setContainerHeight(element.clientHeight)

		element.addEventListener("scroll", handleScroll, { passive: true })

		// Use ResizeObserver if available
		let resizeObserver: ResizeObserver | null = null
		if (typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver(handleResize)
			resizeObserver.observe(element)
		} else {
			window.addEventListener("resize", handleResize)
		}

		return () => {
			element.removeEventListener("scroll", handleScroll)
			if (resizeObserver) {
				resizeObserver.disconnect()
			} else {
				window.removeEventListener("resize", handleResize)
			}
		}
	}, [getScrollElement])

	const getVirtualItems = useCallback((): VirtualItem[] => {
		if (containerHeight === 0 || count === 0) return []

		// Calculate visible range
		const startIndex = Math.max(0, Math.floor(scrollTop / itemSize) - overscan)
		const endIndex = Math.min(count - 1, Math.ceil((scrollTop + containerHeight) / itemSize) + overscan)

		const items: VirtualItem[] = []
		for (let i = startIndex; i <= endIndex; i++) {
			items.push({
				index: i,
				key: i,
				start: i * itemSize,
				size: itemSize,
			})
		}

		return items
	}, [scrollTop, containerHeight, itemSize, count, overscan])

	const getTotalSize = useCallback(() => totalSize, [totalSize])

	return {
		getVirtualItems,
		getTotalSize,
	}
}
