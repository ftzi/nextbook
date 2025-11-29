/**
 * File templates for the Nextbook CLI.
 * These are used to scaffold the initial structure.
 */

export const templates = {
	agents: `# Nextbook - AI Assistant Instructions

This directory contains a [Nextbook](https://github.com/your-org/nextbook) component story setup.

## Structure

- \`layout.tsx\` - Nextbook layout (renders html/body + NextbookShell)
- \`[[...path]]/page.tsx\` - Catch-all route for stories
- \`stories/index.ts\` - Story registry (**MUST have "use client"**)
- \`stories/*.story.tsx\` - Story files

## Adding New Stories

1. Create a story file in \`stories/\`:

\`\`\`tsx
// stories/my-component.story.tsx
import { story } from "nextbook"
import { MyComponent } from "@/components/my-component"

export const Default = story({
  render: () => <MyComponent />,
})
\`\`\`

2. Register it in \`stories/index.ts\`:

\`\`\`tsx
export const { storyTree, loaders } = createStoryRegistry({
  // ... existing stories
  myComponent: () => import("./my-component.story"),
})
\`\`\`

## Key Rules

### "use client" is required
The \`stories/index.ts\` file MUST have \`"use client"\` at the top. The loaders contain functions that cannot cross the server→client boundary.

### Keys become sidebar paths
Registry keys become the sidebar hierarchy:
- \`button: () => import(...)\` → "Button"
- \`forms: { input: () => import(...) }\` → "Forms / Input"

### Named exports become variants
Each named export in a story file becomes a variant:
- \`export const Default\` → "My Component / Default"
- \`export const Large\` → "My Component / Large"

## Zod Controls

Use Zod schemas to auto-generate interactive controls:

\`\`\`tsx
import { z } from "zod"

export const Interactive = story({
  schema: z.object({
    label: z.string().default("Click").describe("Button text"),
    variant: z.enum(["primary", "secondary"]).default("primary"),
    disabled: z.boolean().default(false),
  }),
  render: (props) => <Button {...props} />,
})
\`\`\`

| Zod Type        | Control         |
| --------------- | --------------- |
| \`z.string()\`    | Text input      |
| \`z.number()\`    | Number input    |
| \`z.boolean()\`   | Toggle          |
| \`z.enum([...])\` | Select dropdown |
`,

	layout: `import "globals.css"
import { NextbookShell } from "nextbook"
import type { Metadata } from "next"
import { loaders, storyTree } from "./stories"

export const metadata: Metadata = {
	title: "Nextbook | Component Stories",
	description: "Browse and interact with UI components",
}

export default function NextbookLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<NextbookShell tree={storyTree} loaders={loaders}>
					{children}
				</NextbookShell>
			</body>
		</html>
	)
}
`,

	page: `import { StoryPage } from "nextbook"
import { loaders, storyTree } from "../stories"

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await params
	return <StoryPage path={path} storyTree={storyTree} loaders={loaders} />
}
`,

	storiesIndex: `"use client"

import { createStoryRegistry } from "nextbook"

export const { storyTree, loaders } = createStoryRegistry({
	example: () => import("./example.story"),
})
`,

	exampleStory: `import { story } from "nextbook"
import { z } from "zod"

/**
 * Example story demonstrating Nextbook features.
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
 * Get the import path for nextbook based on whether it's a workspace or npm package.
 */
export function getNextbookImport(isWorkspace: boolean): string {
	return isWorkspace ? "@workspace/nextbook" : "nextbook"
}

/**
 * Replace nextbook with the correct import path in templates.
 */
export function replaceImports(template: string, isWorkspace: boolean): string {
	if (isWorkspace) {
		return template.replace(/from "nextbook"/g, 'from "@workspace/nextbook"')
	}
	return template
}
