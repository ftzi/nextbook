import type { z } from "zod"
import type { Story, StoryConfig } from "./types"

/**
 * Creates a story for Storify.
 *
 * @example
 * // Simple story without controls
 * export const Primary = story({
 *   render: () => <Button>Click me</Button>,
 * })
 *
 * @example
 * // Story with Zod schema for controlled props
 * export const Controlled = story({
 *   schema: z.object({
 *     variant: z.enum(['primary', 'secondary']).default('primary').describe('Button style'),
 *     disabled: z.boolean().default(false).describe('Disabled state'),
 *   }),
 *   render: (props) => <Button {...props}>Click me</Button>,
 * })
 *
 * @param config - Story configuration with optional schema and required render function
 * @returns A story object that Storify can detect and render
 */
export function story<TSchema extends z.ZodType | undefined = undefined>(config: StoryConfig<TSchema>): Story<TSchema> {
	return {
		__storify: true,
		schema: config.schema as TSchema,
		render: config.render as Story<TSchema>["render"],
		mocks: config.mocks as Story<TSchema>["mocks"],
	}
}

/**
 * Type guard to check if a value is a Storify story.
 */
export function isStory(value: unknown): value is Story<z.ZodType | undefined> {
	return typeof value === "object" && value !== null && "__storify" in value && value.__storify === true
}
