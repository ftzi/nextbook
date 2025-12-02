import { describe, expect, test } from "bun:test"
import { HttpResponse, http } from "msw"
import { z } from "zod"
import { isStory, story } from "./story"

describe("story", () => {
	test("creates a simple story without schema", () => {
		const result = story({
			render: () => null,
		})

		expect(result.__nextbook).toBe(true)
		expect(result.schema).toBeUndefined()
		expect(result.render).toBeInstanceOf(Function)
		expect(result.mocks).toBeUndefined()
	})

	test("creates a story with schema", () => {
		const schema = z.object({
			label: z.string().default("test"),
		})

		const result = story({
			schema,
			render: (props) => props.label,
		})

		expect(result.__nextbook).toBe(true)
		expect(result.schema).toBe(schema)
		expect(result.render).toBeInstanceOf(Function)
		expect(result.mocks).toBeUndefined()
	})

	test("creates a story with static mocks", () => {
		const mockHandlers = [
			http.get("/api/user", () => HttpResponse.json({ name: "John" })),
			http.post("/api/data", () => HttpResponse.json({ success: true })),
		]

		const result = story({
			render: () => null,
			mocks: mockHandlers,
		})

		expect(result.__nextbook).toBe(true)
		expect(result.mocks).toBe(mockHandlers)
		expect(result.mocks).toHaveLength(2)
	})

	test("creates a story with mock factory function", () => {
		const schema = z.object({
			userId: z.string().default("123"),
		})

		const mockFactory = (props: { userId: string }) => [
			http.get(`/api/user/${props.userId}`, () => HttpResponse.json({ id: props.userId })),
		]

		const result = story({
			schema,
			render: (props) => props.userId,
			mocks: mockFactory,
		})

		expect(result.__nextbook).toBe(true)
		expect(result.mocks).toBe(mockFactory)
		expect(typeof result.mocks).toBe("function")
	})
})

describe("isStory", () => {
	test("returns true for story objects", () => {
		const storyObj = story({ render: () => null })
		expect(isStory(storyObj)).toBe(true)
	})

	test("returns false for non-story objects", () => {
		expect(isStory(null)).toBe(false)
		expect(isStory(undefined)).toBe(false)
		expect(isStory({})).toBe(false)
		expect(isStory({ __nextbook: false })).toBe(false)
		expect(isStory({ render: () => null })).toBe(false)
	})
})
