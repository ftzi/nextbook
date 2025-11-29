# Project Context

## Purpose

Nextbook is a zero-config component stories library for Next.js. It enables developers to create interactive component documentation with minimal setup. The library is designed to be AI-friendly, with a simple API (`story()` function + Zod schemas) that makes it easy for AI assistants to generate stories instantly.

## Tech Stack

- **Runtime:** Bun 1.3.3 (package manager and runtime)
- **Language:** TypeScript 5.9.3 (strict mode)
- **Framework:** Next.js 16.0.1 with React 19.2.0
- **Schema Validation:** Zod 4.1.12 (supports both Zod 3 and 4)
- **Monorepo:** Turborepo
- **Linting/Formatting:** Biome
- **Testing:** Bun test runner (unit), Playwright (visual regression)
- **CLI Framework:** citty

## Project Conventions

### Code Style

- **Biome** handles all formatting and linting
- **NEVER use `any` type** - use `unknown` if truly unknown, but avoid even that
- **NEVER use `interface`** - always use `type` instead
- **NEVER use barrel files** - import directly from source files (exception: `packages/nextbook/src/index.ts` is the public API)
- Prefer object parameters over multiple direct parameters
- Use optional chaining for callbacks: `onComplete?.(data)`
- Only add comments for complex logic that isn't self-evident
- Always stringify objects in console logs, and clean up debug code when done

### Architecture Patterns

- **Monorepo Structure:**
  - `packages/nextbook/` - Main library (published to npm)
  - `apps/example/` - Example Next.js app
  - `packages/typescript-config/` - Shared TS configs

- **Server/Client Boundary:**
  - `stories/index.ts` must have `"use client"` directive
  - `NextbookShell` is a client component
  - User's layout.tsx (Server Component) renders `<html>` and `<body>` tags

- **Lazy Loading Strategy:**
  1. `createStoryRegistry()` - Only parses file paths (no modules loaded)
  2. Sidebar expansion - Loads exports to show variants
  3. Story viewing - Loads module to render

- **Styling Architecture:**
  - CSS Modules for complete isolation
  - No Tailwind dependency (works with any CSS setup)
  - CSS Custom Properties for design tokens
  - Dark mode via `prefers-color-scheme`

### Testing Strategy

- **Unit tests:** Bun's built-in test runner (`bun test`)
- **Visual regression:** Playwright (`bun test:e2e`)
- Never use `timeout` parameters - trust default timeouts
- Example app serves as test fixtures for visual regression

### Git Workflow

- Never commit or push code automatically - all git operations must be explicitly requested
- Keep root README.md in sync with code at all times
- Manual setup in README must match CLI output

## Domain Context

- **Story Function:** The `story()` function is the core API for defining component stories
- **Zod Integration:** Schema introspection generates interactive controls automatically
- **NextbookShell:** Main wrapper component that provides the stories UI
- **StoryPage:** Renders individual stories with error boundaries

## Important Constraints

- Node.js >= 20 required
- Default to Server Components; use `"use client"` only when needed
- Always run `bun ok` from project root (never from subdirectories)
- Never run `tsc` directly - always use `bun ok`
- Never run `bun build` for verification - only use `bun ok`
- CLI templates (`src/cli/templates.ts`) must stay in sync with current API

## External Dependencies

- Published to npm as `nextbook`
- No external services or APIs required
- Self-contained library that integrates into user's Next.js app
