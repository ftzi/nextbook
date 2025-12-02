import type { RequestHandler } from "msw"
import type { ReactNode } from "react"
import type { z } from "zod"

/**
 * MSW request handler type.
 * When users have MSW installed, they get full type safety from MSW's types.
 */
export type MockHandler = RequestHandler

/**
 * Mock handlers for a story - either a static array or a factory function.
 * Factory functions receive the current control values and can return dynamic mocks.
 */
export type StoryMocks<TProps = never> = MockHandler[] | ((props: TProps) => MockHandler[])

/**
 * Configuration for a story with optional Zod schema for auto-generated controls.
 *
 * @example
 * // Simple story without controls
 * story({
 *   render: () => <Button>Click me</Button>,
 * })
 *
 * @example
 * // Story with Zod schema for interactive controls
 * story({
 *   schema: z.object({
 *     variant: z.enum(['primary', 'secondary']).default('primary').describe('Visual style of the button'),
 *     disabled: z.boolean().default(false).describe('Whether the button is disabled'),
 *   }),
 *   render: (props) => <Button {...props}>Click me</Button>,
 * })
 */
export type StoryConfig<TSchema extends z.ZodType | undefined = undefined> = TSchema extends z.ZodType
	? {
			/** Zod schema for auto-generating controls. Use .default() for initial values and .describe() for optional descriptions. */
			schema: TSchema
			/** Render function that receives typed props from the schema */
			render: (props: z.output<TSchema>) => ReactNode
			/** Optional MSW request handlers for mocking API calls. Can be a static array or a factory function that receives control values. */
			mocks?: StoryMocks<z.output<TSchema>>
		}
	: {
			/** Optional Zod schema - omit for simple stories without controls */
			schema?: undefined
			/** Render function for the story */
			render: () => ReactNode
			/** Optional MSW request handlers for mocking API calls. */
			mocks?: MockHandler[]
		}

/**
 * A story object created by the story() function.
 * Contains metadata for Nextbook to detect and render stories.
 */
export type Story<TSchema extends z.ZodType | undefined = undefined> = {
	/** Marker for Nextbook to identify story objects */
	readonly __nextbook: true
	/** The Zod schema (if provided) */
	readonly schema: TSchema
	/** The render function */
	readonly render: TSchema extends z.ZodType ? (props: z.output<TSchema>) => ReactNode : () => ReactNode
	/** Optional MSW request handlers for mocking API calls */
	readonly mocks?: TSchema extends z.ZodType ? StoryMocks<z.output<TSchema>> : MockHandler[]
}

/**
 * Configuration for a matrix story that generates all prop combinations.
 */
export type MatrixStoryConfig<TSchema extends z.ZodObject<z.ZodRawShape>> = {
	/** Zod object schema for generating combinations. Must include enums or booleans for meaningful variation. */
	schema: TSchema
	/** Render function that receives typed props from the schema */
	render: (props: z.output<TSchema>) => ReactNode
}

/**
 * A matrix story object created by the storyMatrix() function.
 * Contains metadata for Nextbook to detect and render as a matrix view.
 */
export type MatrixStory<TSchema extends z.ZodObject<z.ZodRawShape>> = {
	/** Marker for Nextbook to identify story objects */
	readonly __nextbook: true
	/** Marker to identify matrix stories */
	readonly __nextbook_matrix: true
	/** The Zod object schema */
	readonly schema: TSchema
	/** The render function */
	readonly render: (props: z.output<TSchema>) => ReactNode
	/** Optional MSW request handlers for mocking API calls (not typically used with matrix stories) */
	readonly mocks?: StoryMocks<z.output<TSchema>>
}

/**
 * A single combination of prop values for matrix rendering.
 */
export type PropCombination = {
	/** The prop values for this combination */
	values: Record<string, unknown>
	/** Human-readable label for this combination */
	label: string
}

/**
 * Metadata about a discovered story for the sidebar and routing.
 */
export type StoryMeta = {
	/** Full path segments (e.g., ['Forms', 'Input', 'Primary']) */
	path: string[]
	/** Display name (last segment, capitalized) */
	name: string
	/** File path relative to stories directory */
	filePath: string
	/** Export name in the file */
	exportName: string
}

/**
 * Tree structure for sidebar navigation.
 */
export type StoryTreeNode = {
	/** Display name */
	name: string
	/** URL path segment */
	segment: string
	/** Child nodes (for directories) */
	children?: StoryTreeNode[]
	/** Story metadata (for leaf nodes with discovered exports) */
	story?: StoryMeta
	/** File path for lazy loading (leaf nodes before export discovery) */
	filePath?: string
}

/**
 * Control type for the controls panel.
 */
export type ControlType = "text" | "number" | "boolean" | "select"

/**
 * Configuration for a single control in the controls panel.
 */
export type ControlConfig = {
	/** Control type */
	type: ControlType
	/** Field name/key */
	name: string
	/** Display label (derived from prop name) */
	label: string
	/** Optional description of the property (from .describe()) */
	description?: string
	/** Default value (from .default()) */
	defaultValue: unknown
	/** Options for select controls */
	options?: string[]
}

/**
 * Story loader function that dynamically imports a story module.
 */
export type StoryLoader = () => Promise<Record<string, unknown>>

/**
 * Flat loader map - key is the path like "button" or "forms/input".
 */
export type StoryLoaders = Record<string, StoryLoader>

/**
 * The stories object returned by createStories.
 * Pass this to NextbookShell and StoryPage components.
 */
export type Stories = {
	/** Tree structure for sidebar navigation */
	tree: StoryTreeNode[]
	/** Flat map of loaders for lazy loading stories */
	loaders: StoryLoaders
}
