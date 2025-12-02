import { delay, HttpResponse, http } from "msw"
import { story } from "nextbook"
import { z } from "zod"
import { UserCard } from "@/components/demo/user-card"

// Mock user data
const mockUsers = {
	"1": {
		id: "1",
		name: "Jane Cooper",
		email: "jane.cooper@example.com",
		role: "admin" as const,
		avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
	},
	"2": {
		id: "2",
		name: "John Smith",
		email: "john.smith@example.com",
		role: "user" as const,
	},
	"3": {
		id: "3",
		name: "Guest User",
		email: "guest@example.com",
		role: "guest" as const,
	},
}

/**
 * Default story with mocked API response.
 * The "Mocks" indicator appears in the UI when mocks are active.
 */
export const Default = story({
	mocks: [
		http.get("/api/users/:userId", ({ params }) => {
			const user = mockUsers[params.userId as keyof typeof mockUsers]
			if (user) {
				return HttpResponse.json(user)
			}
			return new HttpResponse(null, { status: 404 })
		}),
	],
	render: () => <UserCard userId="1" />,
})

/**
 * Story with configurable user ID via controls.
 * The mock factory updates based on control values.
 */
export const Configurable = story({
	schema: z.object({
		userId: z.enum(["1", "2", "3"]).default("1").describe("Select a user to display"),
	}),
	mocks: [
		http.get("/api/users/:userId", ({ params }) => {
			const user = mockUsers[params.userId as keyof typeof mockUsers]
			if (user) {
				return HttpResponse.json(user)
			}
			return new HttpResponse(null, { status: 404 })
		}),
	],
	render: ({ userId }) => <UserCard userId={userId} />,
})

/**
 * Simulates loading state with an infinite delay.
 * Useful for testing loading UI.
 */
export const Loading = story({
	mocks: [
		http.get("/api/users/:userId", async () => {
			await delay("infinite")
			return HttpResponse.json({})
		}),
	],
	render: () => <UserCard userId="1" />,
})

/**
 * Simulates a slow API response (2 seconds).
 * You can observe the loading state before data appears.
 */
export const SlowResponse = story({
	mocks: [
		http.get("/api/users/:userId", async () => {
			await delay(2000)
			return HttpResponse.json(mockUsers["1"])
		}),
	],
	render: () => <UserCard userId="1" />,
})

/**
 * Simulates a server error (500).
 * Useful for testing error handling UI.
 */
export const ServerError = story({
	mocks: [
		http.get("/api/users/:userId", () => new HttpResponse(null, { status: 500, statusText: "Internal Server Error" })),
	],
	render: () => <UserCard userId="1" />,
})

/**
 * Simulates a not found error (404).
 */
export const NotFound = story({
	mocks: [http.get("/api/users/:userId", () => new HttpResponse(null, { status: 404, statusText: "Not Found" }))],
	render: () => <UserCard userId="999" />,
})

/**
 * Dynamic mock factory example.
 * The mock response changes based on control values.
 */
export const DynamicMocks = story({
	schema: z.object({
		name: z.string().default("Custom User").describe("User's name"),
		email: z.string().default("custom@example.com").describe("User's email"),
		role: z.enum(["admin", "user", "guest"]).default("user").describe("User's role"),
		shouldError: z.boolean().default(false).describe("Simulate API error"),
	}),
	mocks: ({ name, email, role, shouldError }) => [
		http.get("/api/users/:userId", () => {
			if (shouldError) {
				return new HttpResponse(null, { status: 500, statusText: "Simulated Error" })
			}
			return HttpResponse.json({
				id: "custom",
				name,
				email,
				role,
			})
		}),
	],
	render: () => <UserCard userId="custom" />,
})
