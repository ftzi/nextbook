STILL WIP!

STAY TUNED!

<p align="center">
  <img src="./assets/logo.svg" alt="Nextbook" width="400" />
</p>

<h3 align="center">
  Zero-config component stories for Next.js
</h3>
<br/>

Nextbook is a lightweight alternative to Storybook, designed specifically for Next.js. It uses your app's existing configuration - no separate build process, no Tailwind duplication, no webpack config.

## Features

- **Zero Config** - Uses your Next.js app's existing setup
- **Path-Based Hierarchy** - Keys become sidebar structure automatically
- **Zod Controls** - Auto-generate interactive controls from Zod schemas
- **Type Safe** - Full TypeScript support with IntelliSense
- **Lazy Loading** - Stories load on-demand for fast startup
- **Background Switcher** - Toggle between default, striped, and magenta backgrounds to spot component imperfections

## Quick Start

```bash
npx nextbook
# or
bunx nextbook
```

This scaffolds the required files in `app/ui/` and creates an example story.

Then visit `http://localhost:3000/ui` to see your stories.

<details>
<summary>Manual Setup</summary>

### 1. Install

```bash
npm install nextbook
# or
bun add nextbook
```

### 2. Register your stories

```tsx
// app/ui/stories/index.ts
"use client";

import { createStoryRegistry } from "nextbook";

export const { storyTree, loaders } = createStoryRegistry({
  button: () => import("./button.story"),
  forms: {
    input: () => import("./forms/input.story"),
    select: () => import("./forms/select.story"),
  },
});
```

Keys become sidebar paths: `forms.input` → `Forms / Input`

### 3. Create the layout

```tsx
// app/ui/layout.tsx
import "@/app/globals.css";
import { NextbookShell } from "nextbook";
import { loaders, storyTree } from "./stories";

export default function NextbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextbookShell tree={storyTree} loaders={loaders}>
      {children}
    </NextbookShell>
  );
}
```

> **Note:** Don't add `<html>` or `<body>` tags here - Next.js layouts nest, so your root layout already provides them.

### 4. Create the page

```tsx
// app/ui/[[...path]]/page.tsx
import { StoryPage } from "nextbook";
import { loaders, storyTree } from "../stories";

export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  return <StoryPage path={path} storyTree={storyTree} loaders={loaders} />;
}
```

</details>

## Writing Stories

```tsx
// app/ui/stories/button.story.tsx
import { story } from "nextbook";
import { Button } from "@/components/ui/button";

export const Default = story({
  render: () => <Button>Click me</Button>,
});
```

### With Zod Controls

Use Zod schemas to auto-generate interactive controls:

```tsx
import { story } from "nextbook";
import { z } from "zod";
import { Button } from "@/components/ui/button";

export const Interactive = story({
  schema: z.object({
    variant: z
      .enum(["primary", "secondary"])
      .default("primary")
      .describe("Button variant"),
    disabled: z.boolean().default(false).describe("Disabled state"),
    children: z.string().default("Click me").describe("Button text"),
  }),
  render: (props) => <Button {...props} />,
});
```

### Zod → Control Mapping

| Zod Type        | Control         |
| --------------- | --------------- |
| `z.string()`    | Text input      |
| `z.number()`    | Number input    |
| `z.boolean()`   | Toggle          |
| `z.enum([...])` | Select dropdown |

- `.default(value)` - Sets initial control value
- `.describe("Label")` - Sets control label

## File Organization

Stories are organized by the keys you provide to `createStoryRegistry`:

```tsx
export const { storyTree, loaders } = createStoryRegistry({
  button: () => import("./button.story"), // → "Button"
  forms: {
    input: () => import("./forms/input.story"), // → "Forms / Input"
    select: () => import("./forms/select.story"), // → "Forms / Select"
  },
  layout: {
    card: () => import("./layout/card.story"), // → "Layout / Card"
  },
});
```

Named exports become story variants:

```tsx
// button.story.tsx
export const Primary = story({ ... })   // → "Button / Primary"
export const Secondary = story({ ... }) // → "Button / Secondary"
```

## Layout Isolation

If your root layout has providers that conflict with Nextbook, use `useSelectedLayoutSegment` to skip them for the `/ui` route:

```tsx
// app/layout.tsx
"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();

  // Skip providers for Nextbook
  if (segment === "ui") {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Reference: [useSelectedLayoutSegment](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment)

## URL Structure

- `/ui` - Welcome page
- `/ui/button/primary` - Button / Primary story
- `/ui/forms/input/interactive` - Forms / Input / Interactive story

## Access Control

Block in production if needed:

```tsx
// app/ui/layout.tsx
import { notFound } from "next/navigation";
import { NextbookShell } from "nextbook";
import { loaders, storyTree } from "./stories";

export default function NextbookLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return (
    <NextbookShell tree={storyTree} loaders={loaders}>
      {children}
    </NextbookShell>
  );
}
```

## Why Nextbook?

| Feature            | Storybook            | Nextbook    |
| ------------------ | -------------------- | ----------- |
| Setup time         | ~30 min              | ~5 min      |
| Separate build     | Yes                  | No          |
| Config duplication | Yes (Tailwind, etc.) | No          |
| Bundle size        | Large                | Minimal     |
| Hot reload         | Separate process     | Same as app |

<details>
<summary>Development</summary>

```bash
# Install dependencies
bun install

# Start the example app
bun dev

# Type check and lint
bun ok

# Run visual regression tests
bun test:e2e
```

</details>

## License

MIT
