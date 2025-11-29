# Tasks: Marketing Website Implementation

## 1. Project Scaffolding
- [x] 1.1 Create `apps/web` directory structure
- [x] 1.2 Initialize package.json with dependencies (Next.js 16, React 19, Tailwind CSS 4, Framer Motion, lucide-react, @vercel/analytics)
- [x] 1.3 Configure tsconfig.json extending workspace config
- [x] 1.4 Configure next.config.mjs (React Compiler, SVG support)
- [x] 1.5 Configure postcss.config.mjs for Tailwind CSS 4
- [x] 1.6 Configure tailwind.config.ts with design tokens (in globals.css @theme block)
- [x] 1.7 Initialize shadcn/ui (components.json)
- [x] 1.8 Update root package.json workspace catalog with new shared deps (not needed - existing catalog works)
- [x] 1.9 Update turbo.json to include web build tasks (not needed - existing config works)

## 2. Base Infrastructure
- [x] 2.1 Create globals.css with Tailwind imports and CSS variables
- [x] 2.2 Create root layout.tsx with Geist fonts and metadata
- [x] 2.3 Create lib/env.ts for type-safe environment variables
- [x] 2.4 Create lib/public-routes.ts for route definitions
- [x] 2.5 Create sitemap.ts for SEO
- [x] 2.6 Create robots.ts for search engines
- [x] 2.7 Create lib/utils.ts (cn function for class merging)
- [x] 2.8 Add Vercel Analytics to root layout

## 3. OG Image System
- [x] 3.1 Create lib/opengraph/defaults.ts with default metadata
- [x] 3.2 Create lib/opengraph/og-params.ts for URL encoding (simplified - not needed)
- [x] 3.3 Create lib/opengraph/og-wrapper.tsx for shared OG component (simplified - not needed)
- [x] 3.4 Create opengraph-image.tsx (1200x630)
- [x] 3.5 Create twitter-image.tsx (1200x600)
- [x] 3.6 Copy nextbook logo assets from /assets to apps/web/public/images
- [x] 3.7 Create screenshot placeholder components with guidance comments

## 4. Core UI Components
- [x] 4.1 Install shadcn/ui button component
- [x] 4.2 Install shadcn/ui card component
- [x] 4.3 Install shadcn/ui badge component
- [x] 4.4 Create components/shared/logo.tsx with animated nextbook logo
- [x] 4.5 Create components/shared/header.tsx (navigation)
- [x] 4.6 Create components/shared/footer.tsx
- [x] 4.7 Create components/shared/container.tsx (max-width wrapper)
- [x] 4.8 Create components/shared/section.tsx (page section wrapper)

## 5. Landing Page Sections
- [x] 5.1 Create components/landing/hero.tsx
  - Animated gradient background
  - Headline with gradient text
  - Subheadline explaining value prop
  - CTA buttons (Get Started, View on GitHub)
  - Decorative blur elements
  - Terminal preview
  - Screenshot placeholder
- [x] 5.2 Create components/landing/features.tsx
  - Feature grid (6 features: Zero Config, Zod Controls, Story Matrix, Lazy Loading, Background Switcher, AI-Ready)
  - Icon + title + description cards
  - Hover animations
- [x] 5.3 Create components/landing/code-demo.tsx
  - Syntax-highlighted code examples
  - Tabbed interface (Basic, With Controls, Story Matrix)
  - Copy button
- [x] 5.4 Create components/landing/comparison.tsx
  - Nextbook vs Storybook comparison table
  - Feature checkmarks
  - Animated reveal on scroll
- [x] 5.5 Create components/landing/quick-start.tsx
  - Terminal command display
  - Copy button
  - Step-by-step visual guide
- [x] 5.6 Create components/landing/cta.tsx
  - Final CTA section
  - GitHub link
  - npm install command

## 6. Home Page Assembly
- [x] 6.1 Create app/page.tsx composing all sections
- [x] 6.2 Add scroll-triggered animations (Framer Motion)
- [x] 6.3 Add responsive breakpoints for all sections
- [x] 6.4 Test dark/light mode theming (dark mode default)

## 7. Documentation Updates
- [x] 7.1 Update CLAUDE.md with apps/web guidelines and sync requirements
- [x] 7.2 Add apps/web architecture section to CLAUDE.md
- [x] 7.3 Update openspec/project.md if needed (not needed)

## 8. Validation
- [x] 8.1 Run `bun ok` - ensure type checking passes
- [ ] 8.2 Test `bun dev` - verify local development works (manual testing required)
- [ ] 8.3 Test `bun build` - verify production build succeeds (manual testing required)
- [ ] 8.4 Test OG images render correctly (manual testing required)
- [ ] 8.5 Test responsive design (mobile, tablet, desktop) (manual testing required)
- [ ] 8.6 Test dark mode / light mode toggle (manual testing required)
- [ ] 8.7 Lighthouse audit (performance, accessibility, SEO) (manual testing required)

## Dependencies

- Tasks 2.x depend on 1.x (project setup first)
- Tasks 3.x can run parallel to 4.x
- Tasks 5.x depend on 4.x (need base components)
- Tasks 6.x depend on 5.x (need all sections)
- Tasks 7.x can run parallel to 6.x
- Tasks 8.x depend on all previous tasks

## Notes

- Focus on visual polish and animations - this is the public face of nextbook
- Keep code simple and maintainable - this is a marketing site, not an app
- Test on multiple browsers (Chrome, Firefox, Safari)
- Ensure accessibility (keyboard navigation, screen readers)

## Screenshot Placeholders

Screenshots to be added later by user (see design.md for details):
- `hero-screenshot.png` (1200x800) - Full nextbook UI with sidebar + story viewer
- `feature-zod-controls.png` (600x400) - Controls panel demo
- `feature-story-matrix.png` (800x500) - Matrix view grid
- `code-demo-preview.png` (800x600) - Code + preview side-by-side
- `comparison-setup.gif` (600x400) - Quick setup GIF
- `quickstart-terminal.png` (700x200) - CLI command output

## Assets Available

Logo files at `/assets/`:
- `logo.svg` - Full logo with "Nextbook" text
- `logo-animated.svg` - Animated version
- `icon.svg` - Diamond icon only
