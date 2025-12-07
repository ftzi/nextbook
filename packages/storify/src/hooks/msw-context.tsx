"use client"

import type { SetupWorker } from "msw/browser"
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react"

type MswContextValue = {
	worker: SetupWorker | null
	isReady: boolean
}

const MswContext = createContext<MswContextValue>({ worker: null, isReady: false })

/**
 * Hook to access the MSW worker from context.
 * Returns null if MSW is not installed or not ready.
 */
export function useMswWorker() {
	return useContext(MswContext)
}

type MswProviderProps = {
	children: ReactNode
}

/**
 * Provider component that initializes the MSW worker.
 * Uses dynamic import to gracefully handle when MSW is not installed.
 */
export function MswProvider({ children }: MswProviderProps) {
	const [isReady, setIsReady] = useState(false)
	const workerRef = useRef<SetupWorker | null>(null)
	const initAttemptedRef = useRef(false)

	useEffect(() => {
		// Only attempt initialization once
		if (initAttemptedRef.current) return
		initAttemptedRef.current = true

		async function initializeMsw() {
			// Only run in browser
			if (typeof window === "undefined") return

			try {
				// Dynamic import to avoid bundling MSW when not installed
				const { setupWorker } = await import("msw/browser")
				const worker = setupWorker()

				await worker.start({
					onUnhandledRequest: "bypass",
					quiet: true,
				})

				workerRef.current = worker
				setIsReady(true)
			} catch {
				// MSW not installed - mocking features disabled
				// This is expected when users don't need mocking
				setIsReady(true) // Still mark as ready so stories without mocks work
			}
		}

		void initializeMsw()

		return () => {
			workerRef.current?.stop()
		}
	}, [])

	return <MswContext value={{ worker: workerRef.current, isReady }}>{children}</MswContext>
}
