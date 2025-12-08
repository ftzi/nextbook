# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-07

### Added

- **Zero-config setup** - Works with your app's existing configuration
- **Story function** - Simple `story()` API for defining component stories
- **Zod controls** - Auto-generate interactive controls from Zod schemas
- **Story matrix** - Generate all prop combinations with `storyMatrix()`
- **MSW mocking** - Optional API mocking support via Mock Service Worker
- **Theme toggle** - Light/dark/system theme switching for preview area
- **Background switcher** - Default, striped, and checkered backgrounds
- **Pan and zoom** - Navigate large components with drag and scroll
- **Lazy loading** - Stories load on-demand for fast startup
- **AI-first** - Generates `CLAUDE.md` and `AGENTS.md` for AI assistants
- **CLI scaffolding** - `npx @ftzi/storify` sets up files automatically
- **TypeScript support** - Full type safety with IntelliSense
- **CSS Modules** - Isolated styles, works with any CSS setup

### Architecture

- **Zero dependencies** - No runtime dependencies, only peer deps
- **Next.js native** - Uses App Router, no separate build process
- **Virtualized matrix** - Custom virtualization for large grids
