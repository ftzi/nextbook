import type { z } from "zod"
import type { MatrixStory, MatrixStoryConfig } from "./types"

/**
 * Creates a matrix story that displays all prop combinations from a Zod schema.
 *
 * @example
 * // Generate all 12 combinations automatically!
 * // (3 variants × 2 sizes × 2 disabled states)
 * export const AllVariants = storyMatrix({
 *   schema: z.object({
 *     variant: z.enum(['primary', 'secondary', 'ghost']),
 *     size: z.enum(['sm', 'lg']),
 *     disabled: z.boolean(),
 *   }),
 *   render: (props) => <Button {...props}>Click me</Button>,
 * })
 *
 * @param config - Matrix story configuration with schema and render function
 * @returns A matrix story object that Storify renders as a grid of all combinations
 */
export function storyMatrix<TSchema extends z.ZodObject<z.ZodRawShape>>(
	config: MatrixStoryConfig<TSchema>,
): MatrixStory<TSchema> {
	return {
		__storify: true,
		__storify_matrix: true,
		schema: config.schema,
		render: config.render,
	}
}

/**
 * Type guard to check if a value is a Storify matrix story.
 */
export function isMatrixStory(value: unknown): value is MatrixStory<z.ZodObject<z.ZodRawShape>> {
	return (
		typeof value === "object" &&
		value !== null &&
		"__storify" in value &&
		value.__storify === true &&
		"__storify_matrix" in value &&
		value.__storify_matrix === true
	)
}
