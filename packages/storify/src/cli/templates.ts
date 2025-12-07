/**
 * File templates for the Storify CLI.
 * These are used to scaffold the initial structure.
 */

/**
 * AI instruction content (shared between CLAUDE.md and AGENTS.md).
 * Uses markers so users can add custom instructions outside the managed section.
 */
export const aiInstructionsContent = `# Storify Story Instructions

This project uses [Storify](https://storify.dev) for component stories.

## Writing Stories

### Basic Story

\`\`\`tsx
import { story } from "@ftzi/storify"
import { Button } from "@/components/ui/button"

export const Default = story({
  render: () => <Button>Click me</Button>,
})
\`\`\`

### Story with Controls (Zod Schema)

\`\`\`tsx
import { story } from "@ftzi/storify"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const Playground = story({
  schema: z.object({
    children: z.string().default("Click me"),
    variant: z.enum(["default", "secondary", "outline", "ghost"]).default("default"),
    size: z.enum(["sm", "default", "lg"]).default("default"),
    disabled: z.boolean().default(false),
  }),
  render: (props) => <Button {...props} />,
})
\`\`\`

### Story Matrix (All Combinations)

\`\`\`tsx
import { storyMatrix } from "@ftzi/storify"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const AllVariants = storyMatrix({
  schema: z.object({
    variant: z.enum(["default", "secondary", "outline", "ghost"]),
    size: z.enum(["sm", "default", "lg"]),
  }),
  render: (props) => <Button {...props}>Button</Button>,
})
// Generates 4 variants × 3 sizes = 12 stories automatically
\`\`\`

## Zod Schema Patterns

| Type | Pattern | UI Control |
|------|---------|------------|
| String | \`z.string().default("text")\` | Text input |
| Number | \`z.number().default(0)\` | Number input |
| Boolean | \`z.boolean().default(false)\` | Checkbox |
| Enum | \`z.enum(["a", "b"]).default("a")\` | Select dropdown |
| Optional | \`z.string().optional()\` | Input with clear |

## File Conventions

- Story files: \`*.story.tsx\`
- Location: \`stories/\` directory
- One component per story file
- Export multiple variants from same file

## Registering Stories

After creating a story file, register it in \`stories/index.ts\`:

\`\`\`tsx
"use client"

import { createStories } from "@ftzi/storify"

export const stories = createStories({
  button: () => import("./button.story"),
  card: () => import("./card.story"),
  // Nested structure for organization:
  forms: {
    input: () => import("./forms/input.story"),
    select: () => import("./forms/select.story"),
  },
})
\`\`\`

**IMPORTANT:** The \`stories/index.ts\` file MUST have \`"use client"\` at the top.

## Best Practices

1. **Always provide defaults** — Use \`.default()\` on schema fields
2. **Use descriptive export names** — \`Default\`, \`WithIcon\`, \`Disabled\`
3. **Group related variants** — Keep all Button stories in \`button.story.tsx\`
4. **Use storyMatrix for exhaustive testing** — Cover all prop combinations
5. **Add descriptions** — Use \`.describe("hint")\` for control labels
`

export const templates = {
	aiInstructions: aiInstructionsContent,

	layout: `import "@/app/globals.css"
import { StorifyShell } from "@ftzi/storify"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { stories } from "./stories"

export const metadata: Metadata = {
	title: "Storify | Component Stories",
	description: "Browse and interact with UI components",
}

export default function StorifyLayout({ children }: { children: React.ReactNode }) {
	if (process.env.NODE_ENV === "production") {
		notFound()
	}

	return (
		<StorifyShell stories={stories}>
			{children}
		</StorifyShell>
	)
}
`,

	page: `import { StoryPage } from "@ftzi/storify"
import { stories } from "../stories"

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await params
	return <StoryPage path={path} stories={stories} />
}
`,

	storiesIndex: `"use client"

import { createStories } from "@ftzi/storify"

export const stories = createStories({
	example: () => import("./example.story"),
})
`,

	exampleStory: `import { story } from "@ftzi/storify"
import { z } from "zod"

/**
 * Example story demonstrating Storify features.
 * Replace this with your own components!
 */

export const Default = story({
	render: () => (
		<button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
			Click me
		</button>
	),
})

export const WithControls = story({
	schema: z.object({
		label: z.string().default("Click me").describe("Button text"),
		variant: z.enum(["primary", "secondary"]).default("primary").describe("Button style"),
		disabled: z.boolean().default(false).describe("Disabled state"),
	}),
	render: ({ label, variant, disabled }) => (
		<button
			disabled={disabled}
			className={\`rounded-md px-4 py-2 \${
				variant === "primary"
					? "bg-blue-600 text-white hover:bg-blue-700"
					: "bg-gray-200 text-gray-800 hover:bg-gray-300"
			} \${disabled ? "cursor-not-allowed opacity-50" : ""}\`}
		>
			{label}
		</button>
	),
})
`,
}

/**
 * Get the import path for storify based on whether it's a workspace or npm package.
 */
export function getStorifyImport(isWorkspace: boolean): string {
	return isWorkspace ? "@workspace/storify" : "@ftzi/storify"
}

/**
 * Replace storify with the correct import path in templates.
 */
export function replaceImports(template: string, isWorkspace: boolean): string {
	if (isWorkspace) {
		return template.replace(/from "@ftzi\/storify"/g, 'from "@workspace/storify"')
	}
	return template
}
