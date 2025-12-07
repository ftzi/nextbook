# Nextbook Project

## Overview

**Codebase:** `packages/nextbook/`

Nextbook is a zero-config, zero-dependency component stories library for Next.js. It enables developers to create interactive component documentation with minimal setup.

## Domain Knowledge

### Core Concepts

- **Story** — A component example defined with the `story()` function
- **Story file** — A `.story.tsx` file containing one or more story exports
- **Controlled story** — A story with a Zod schema that generates interactive controls
- **Matrix story** — A story created with `storyMatrix()` showing all prop combinations
- **NextbookShell** — Main wrapper component that provides the UI shell
- **StoryPage** — Server component that renders individual stories

### Key API

```typescript
// Basic story
export const Default = story({
  render: () => <Button>Click me</Button>
})

// Controlled story with Zod schema
export const Controlled = story({
  schema: z.object({
    variant: z.enum(['primary', 'secondary']).default('primary'),
    disabled: z.boolean().default(false),
  }),
  render: (props) => <Button {...props}>Click me</Button>
})

// Matrix story
export const AllVariants = storyMatrix({
  schema: z.object({
    variant: z.enum(['primary', 'secondary']),
    size: z.enum(['sm', 'md', 'lg']),
  }),
  render: (props) => <Button {...props}>Click me</Button>
})
```

### Architecture Patterns

- **Lazy loading** — Story modules loaded on-demand, not at initialization
- **CSS Modules** — All component styles use `.module.css` for isolation
- **Server/Client boundary** — `stories/index.ts` must have `"use client"`
- **Zero dependencies** — No runtime dependencies, only peer deps

## Gotchas

- CLI templates (`src/cli/templates.ts`) must stay in sync with current API
- The `createStories()` function is synchronous (was async before, caused issues)
- User's layout.tsx must render `<html>` and `<body>` tags, not nextbook's layout

## Related Specs

- [Story API](specs/story-api/spec.md) — Core story function and types
- [Sidebar Navigation](specs/sidebar/spec.md) — Sidebar component behavior
- [Controls Panel](specs/controls-panel/spec.md) — Zod-generated controls UI
- [Matrix Viewer](specs/matrix-viewer/spec.md) — Matrix story virtualization
