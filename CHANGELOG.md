# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-03

Initial stable release.

### Features

- **Zero Dependencies** - No runtime dependencies, just peer dependencies (next, react, zod)
- **Zero Config** - Uses your Next.js app's existing setup, no separate build process
- **Path-Based Hierarchy** - Keys become sidebar structure automatically
- **Zod Controls** - Auto-generate interactive controls from Zod schemas
- **Story Matrix** - Auto-generate ALL prop combinations with `storyMatrix()`
- **Type Safe** - Full TypeScript support with IntelliSense
- **Lazy Loading** - Stories load on-demand for fast startup
- **Background Switcher** - Toggle between default, striped, and checkered backgrounds
- **Theme Toggle** - Switch between system, light, and dark modes
- **Pan & Zoom** - Navigate large components with mouse drag and scroll wheel
- **API Mocking** - Optional MSW integration to mock API endpoints in stories
- **AI-Ready** - Simple, predictable API that AI assistants can use instantly
- **CLI** - Quick start with `npx nextbook`

### Components

- `NextbookShell` - Main shell component with sidebar navigation
- `StoryPage` - Story rendering with error boundary
- `story()` - Create individual stories with optional Zod schema controls
- `storyMatrix()` - Generate all prop combinations automatically
- `createStories()` - Register stories with lazy loading
