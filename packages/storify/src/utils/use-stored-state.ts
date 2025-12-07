"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * Type-safe, reactive localStorage hook.
 * - Validates data on read (rejects invalid data)
 * - Syncs across tabs via storage events
 * - SSR-safe with useSyncExternalStore
 */

type Validator<T> = (value: unknown) => value is T

type StoredStateConfig<T> = {
	key: string
	validator: Validator<T>
	defaultValue: T
}

// Storage event listeners for cross-tab sync
const listeners = new Map<string, Set<() => void>>()

function subscribe(key: string, callback: () => void) {
	if (!listeners.has(key)) {
		listeners.set(key, new Set())
	}
	listeners.get(key)?.add(callback)

	return () => {
		listeners.get(key)?.delete(callback)
	}
}

function notifyListeners(key: string) {
	listeners.get(key)?.forEach((cb) => {
		cb()
	})
}

// Listen to storage events from other tabs
if (typeof window !== "undefined") {
	window.addEventListener("storage", (e) => {
		if (e.key) {
			notifyListeners(e.key)
		}
	})
}

function getStoredValue<T>({ key, validator, defaultValue }: StoredStateConfig<T>): T {
	if (typeof window === "undefined") {
		return defaultValue
	}

	try {
		const stored = localStorage.getItem(key)
		if (stored === null) {
			return defaultValue
		}

		const parsed = JSON.parse(stored)
		if (validator(parsed)) {
			return parsed
		}

		// Invalid data, clear it
		localStorage.removeItem(key)
		return defaultValue
	} catch {
		// JSON parse error or localStorage error
		return defaultValue
	}
}

export function useStoredState<T>({ key, validator, defaultValue }: StoredStateConfig<T>): [T, (value: T) => void] {
	// Use useSyncExternalStore for SSR-safe reactive updates
	const value = useSyncExternalStore(
		useCallback((callback) => subscribe(key, callback), [key]),
		() => getStoredValue({ key, validator, defaultValue }),
		() => defaultValue,
	)

	const setValue = useCallback(
		(newValue: T) => {
			try {
				localStorage.setItem(key, JSON.stringify(newValue))
				notifyListeners(key)
			} catch {
				// localStorage might be full or disabled
			}
		},
		[key],
	)

	return [value, setValue]
}

// ============================================
// Storify Storage Schema
// ============================================

const STORAGE_PREFIX = "storify-"

// Theme
export type ThemeMode = "system" | "light" | "dark"

function isThemeMode(value: unknown): value is ThemeMode {
	return value === "system" || value === "light" || value === "dark"
}

export function useTheme() {
	return useStoredState<ThemeMode>({
		key: `${STORAGE_PREFIX}theme`,
		validator: isThemeMode,
		defaultValue: "system",
	})
}

// Background
export type BackgroundType = "default" | "striped" | "checkered"

function isBackgroundType(value: unknown): value is BackgroundType {
	return value === "default" || value === "striped" || value === "checkered"
}

export function useBackground() {
	return useStoredState<BackgroundType>({
		key: `${STORAGE_PREFIX}background`,
		validator: isBackgroundType,
		defaultValue: "default",
	})
}
