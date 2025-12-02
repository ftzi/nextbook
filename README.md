STILL WIP!

<p align="center">
  <img src="https://github.com/ftzi/nextbook/blob/main/assets/logo.svg" alt="Nextbook" width="400" />
</p>

<h3 align="center">
  Next-gen component stories for Next.js
</h3>

<div align="center">

[![npm](https://img.shields.io/npm/v/nextbook)](https://www.npmjs.com/package/nextbook)
[![npm](https://img.shields.io/npm/dt/nextbook)](https://www.npmjs.com/package/nextbook)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</div>
<br/>

Nextbook is a lightweight alternative to Storybook, designed specifically for Next.js. It uses your app's existing configuration - no separate build process, no Tailwind duplication, no webpack config.

## ✨ Features

- **Zero Config** - Uses your Next.js app's existing setup
- **Path-Based Hierarchy** - Keys become sidebar structure automatically
- **Zod Controls** - Auto-generate interactive controls from Zod schemas
- **Story Matrix** - Auto-generate ALL prop combinations from Zod schemas (game-changer)
- **Type Safe** - Full TypeScript support with IntelliSense
- **Lazy Loading** - Stories load on-demand for fast startup
- **Background Switcher** - Toggle between default and striped backgrounds to spot component imperfections
- **AI-Ready** - Simple, predictable API that AI assistants can use to generate stories instantly
- **API Mocking** - Optional MSW integration to mock API endpoints in stories

## 🚀 Quick Start

```bash
npx nextbook # or: bunx, pnpm dlx, yarn dlx, etc.
```

This scaffolds the required files in `app/ui/` and creates an example story.

Then visit `http://localhost:3000/ui` to see your stories.

<details>
<summary>Manual Setup (alternative to CLI)</summary>

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

import { createStories } from "nextbook";

export const stories = createStories({
  button: () => import("./button.story"),
  forms: {
    input: () => import("./forms/input.story"),
    select: () => import("./forms/select.story"),
  },
});
```

Keys become sidebar paths: `forms.input` → `Forms > Input`

### 3. Create the layout

```tsx
// app/ui/layout.tsx
import "@/app/globals.css";
import { NextbookShell } from "nextbook";
import { notFound } from "next/navigation";
import { stories } from "./stories";

export default function NextbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <NextbookShell stories={stories}>
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
import { stories } from "../stories";

export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  return <StoryPage path={path} stories={stories} />;
}
```

</details>

## 📝 Writing Stories

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

export const Controlled = story({
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
- `.describe("...")` - Adds optional description (shown as tooltip on ℹ️ icon)

### Story Matrix (Automatic Combinatorial Testing)

This is the killer feature. Instead of manually writing dozens of story variants, let Nextbook generate ALL combinations automatically:

```tsx
import { storyMatrix } from "nextbook";
import { z } from "zod";
import { Button } from "@/components/ui/button";

// This single export generates 12 visual tests automatically!
// (3 variants × 2 sizes × 2 disabled states = 12 combinations)
export const Matrix = storyMatrix({
  schema: z.object({
    variant: z.enum(["primary", "secondary", "ghost"]),
    size: z.enum(["sm", "lg"]),
    disabled: z.boolean(),
  }),
  render: (props) => <Button {...props}>Click me</Button>,
});
```

The matrix view displays all combinations in a grid:

```
┌─────────────────────┬─────────────────────┬─────────────────────┐
│ primary, sm, false  │ secondary, sm, false│ ghost, sm, false    │
│     [Button]        │     [Button]        │     [Button]        │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ primary, sm, true   │ secondary, sm, true │ ghost, sm, true     │
│     [Button]        │     [Button]        │     [Button]        │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ primary, lg, false  │ secondary, lg, false│ ghost, lg, false    │
│     [Button]        │     [Button]        │     [Button]        │
└─────────────────────┴─────────────────────┴─────────────────────┘
... and so on
```

**Why this matters:**
- **Zero boilerplate** - No more writing `PrimarySmall`, `PrimaryLarge`, `SecondarySmall`...
- **Complete coverage** - Never miss a combination again
- **Always in sync** - Add a new variant? The matrix updates automatically
- **Visual regression at scale** - See every state at once, catch issues instantly

## 📁 File Organization

Stories are organized by the keys you provide to `createStories`:

```tsx
export const stories = createStories({
  button: () => import("./button.story"), // → "Button"
  forms: {
    input: () => import("./forms/input.story"), // → "Forms > Input"
    select: () => import("./forms/select.story"), // → "Forms > Select"
  },
  layout: {
    card: () => import("./layout/card.story"), // → "Layout > Card"
  },
});
```

Named exports become story variants:

```tsx
// button.story.tsx
export const Primary = story({ ... })   // → "Button > Primary"
export const Secondary = story({ ... }) // → "Button > Secondary"
```

## 🔌 Mocking API Requests

Nextbook supports [MSW (Mock Service Worker)](https://mswjs.io/) for mocking API endpoints in your stories. This is useful for testing components that fetch data without hitting real backends.

### Setup MSW

```bash
# Install MSW
npm install msw --save-dev

# Initialize service worker (creates public/mockServiceWorker.js)
npx msw init public
```

### Basic Mocking

Add a `mocks` array to your story to intercept network requests:

```tsx
import { story } from "nextbook";
import { http, HttpResponse } from "msw";

export const WithMockedData = story({
  mocks: [
    http.get("/api/user", () => HttpResponse.json({ name: "John Doe" })),
    http.get("/api/posts", () => HttpResponse.json([
      { id: 1, title: "First Post" },
      { id: 2, title: "Second Post" },
    ])),
  ],
  render: () => <UserDashboard />,
});
```

When viewing this story, a "Mocks" indicator appears in the header showing that API requests are being intercepted.

### Mock Factories (Dynamic Mocks)

Mocks can be a function that receives control values, allowing dynamic mock responses:

```tsx
export const Configurable = story({
  schema: z.object({
    userName: z.string().default("Jane"),
    shouldError: z.boolean().default(false).describe("Simulate API error"),
  }),
  mocks: ({ userName, shouldError }) => [
    http.get("/api/user", () => {
      if (shouldError) {
        return new HttpResponse(null, { status: 500 });
      }
      return HttpResponse.json({ name: userName });
    }),
  ],
  render: () => <UserProfile />,
});
```

Now you can toggle `shouldError` in the controls panel to test error states!

### Testing Loading States

```tsx
import { delay } from "msw";

export const Loading = story({
  mocks: [
    http.get("/api/user", async () => {
      await delay("infinite"); // Never resolves
      return HttpResponse.json({});
    }),
  ],
  render: () => <UserProfile />,
});
```

### Alternative: Prop-Based Mocking

For simpler cases, you can pass mock functions as props (no MSW needed):

```tsx
export const WithMockFetcher = story({
  schema: z.object({
    fetchUser: z.function().returns(z.promise(z.object({ name: z.string() }))),
  }),
  render: ({ fetchUser }) => <UserProfile fetchUser={fetchUser} />,
});
```

This approach requires your component to accept the fetcher as a prop.

### Generating Mock Data

For generating realistic mock data from Zod schemas, check out [@anatine/zod-mock](https://github.com/anatine/zod-plugins/tree/main/packages/zod-mock):

```tsx
import { generateMock } from "@anatine/zod-mock";

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export const WithGeneratedData = story({
  mocks: [
    http.get("/api/user", () => HttpResponse.json(generateMock(userSchema))),
  ],
  render: () => <UserProfile />,
});
```

## 🔒 Layout Isolation

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

## 🛡️ Access Control

By default, the generated layout blocks access in production. This condition can be changed to disable Nextbook based on your needs:

```tsx
// app/ui/layout.tsx
export default function NextbookLayout({ children }: { children: React.ReactNode }) {
  // Change this condition to control when Nextbook is disabled
  // if (process.env.NODE_ENV === "production") {
  //   notFound();
  // }

  return (
    <NextbookShell stories={stories}>
      {children}
    </NextbookShell>
  );
}
```

## 💡 Why Nextbook?

### The Storybook Problem

With Storybook, you manually write each variant:

```tsx
// Storybook: Write EVERY combination by hand 😩
export const Primary = () => <Button variant="primary" />
export const Secondary = () => <Button variant="secondary" />
export const Ghost = () => <Button variant="ghost" />
export const PrimarySmall = () => <Button variant="primary" size="sm" />
export const PrimaryLarge = () => <Button variant="primary" size="lg" />
export const PrimaryDisabled = () => <Button variant="primary" disabled />
export const SecondarySmall = () => <Button variant="secondary" size="sm" />
export const SecondaryLarge = () => <Button variant="secondary" size="lg" />
export const SecondaryDisabled = () => <Button variant="secondary" disabled />
// ... 20+ more exports, and you STILL missed some combinations
```

### The Nextbook Solution

```tsx
// Generates ALL 36 combinations automatically 🎉
export const Matrix = storyMatrix({
  schema: z.object({
    variant: z.enum(["primary", "secondary", "ghost"]),
    size: z.enum(["sm", "md", "lg"]),
    disabled: z.boolean(),
    loading: z.boolean(),
  }),
  render: (props) => <Button {...props}>Click me</Button>,
});
```

### Feature Comparison

| Feature                 | Storybook                    | Nextbook                     |
| ----------------------- | ---------------------------- | ---------------------------- |
| Setup time              | ~30 min                      | ~5 min                       |
| Separate build          | Yes                          | No                           |
| Config duplication      | Yes (Tailwind, etc.)         | No                           |
| Bundle size             | Large                        | Minimal                      |
| Hot reload              | Separate process             | Same as app                  |
| **Combinatorial testing** | Manual (write each variant) | **Automatic (storyMatrix)** |
| Variant coverage        | Whatever you remember        | **100% guaranteed**          |
| Maintenance burden      | High (keep variants in sync) | **Zero (schema is truth)**  |
| API Mocking             | Addon (msw-storybook-addon)  | Built-in (optional MSW)      |

## 🤖 AI-Ready

Nextbook is designed to work seamlessly with AI assistants. The simple, predictable API makes it easy for AI to generate stories for your components instantly.

Just ask your AI assistant:

> "Create a nextbook story for my Button component with variants for primary, secondary, and disabled states"

The straightforward `story()` function and Zod schema integration means AI can quickly understand your component props and generate comprehensive stories with interactive controls - no complex configuration to explain.

## 🛠️ Development

<details>
<summary>Commands</summary>

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

## 📄 License

MIT
