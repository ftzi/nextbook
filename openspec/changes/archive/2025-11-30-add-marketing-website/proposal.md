# Change: Add Marketing Website for nextbook.dev

## Why

Nextbook has grown significantly and now has its own domain: **nextbook.dev**. A professional marketing website will:
- Showcase nextbook's features to potential users
- Provide beautiful, interactive documentation
- Establish brand credibility with a modern, polished presence
- Drive adoption through compelling visuals and clear value propositions

## What Changes

### New: `apps/web` Marketing Website

A stunning, modern marketing website inspired by Vercel, Next.js, Storybook, and Chromatic:

- **Next.js 16** with React 19 and React Compiler
- **shadcn/ui** components with Tailwind CSS 4
- **Framer Motion** animations for smooth micro-interactions
- **OG Image Generation** using Next.js ImageResponse API
- **SEO Infrastructure** (sitemap.ts, robots.ts, structured metadata)
- **Landing Page Sections:**
  - Hero with animated gradient backgrounds
  - Features showcase with interactive demos
  - Code examples with syntax highlighting
  - Comparison table (Nextbook vs Storybook)
  - Testimonials/social proof section
  - CTA sections

### Modified: CLAUDE.md

Update development guidelines to include:
- Documentation synchronization: README.md AND apps/web must stay in sync with code
- Web app architecture patterns
- Marketing website conventions

### Modified: Monorepo Structure

- Add `apps/web` as new workspace
- Add shared catalog dependencies (Tailwind, Framer Motion)
- Update turbo.json for web build tasks

## Impact

- **Affected specs:** None (new capability)
- **Affected code:**
  - New: `apps/web/*` (entire web application)
  - Modified: `package.json` (workspace catalog)
  - Modified: `turbo.json` (build tasks)
  - Modified: `CLAUDE.md` (guidelines)

## Notes

- Domain: nextbook.dev (already purchased)
- Deployment target: Vercel
- No backend required initially - pure marketing/docs site
- Will need environment variable: `NEXT_PUBLIC_URL=https://nextbook.dev`
