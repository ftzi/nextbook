# Plan: Add Marketing Website for storify.dev

## Summary

Create a professional marketing website at storify.dev to showcase storify's features, provide documentation, and drive adoption.

## Why

Storify has grown significantly and now has its own domain: **storify.dev**. A professional marketing website will:
- Showcase storify's features to potential users
- Provide beautiful, interactive documentation
- Establish brand credibility with a modern, polished presence
- Drive adoption through compelling visuals and clear value propositions

## What Changes

### New: `apps/nextjs` Marketing Website

A modern marketing website inspired by Vercel, Next.js, and Storybook:

- **Next.js 16** with React 19 and React Compiler
- **shadcn/ui** components with Tailwind CSS 4
- **Framer Motion** animations for smooth micro-interactions
- **OG Image Generation** using Next.js ImageResponse API
- **SEO Infrastructure** (sitemap.ts, robots.ts, structured metadata)
- **Landing Page Sections:**
  - Hero with animated gradient backgrounds
  - Features showcase with interactive demos
  - Code examples with syntax highlighting
  - Comparison table (Storify vs Storybook)
  - CTA sections

### Modified: CLAUDE.md

Update development guidelines to include:
- Documentation synchronization: README.md AND apps/nextjs must stay in sync
- Web app architecture patterns
- Marketing website conventions

### Modified: Monorepo Structure

- Add `apps/nextjs` as new workspace
- Add shared catalog dependencies
- Update turbo.json for web build tasks

## Tasks

### Phase 1: Project Scaffolding
- [x] 1.1 Create `apps/nextjs` directory structure
- [x] 1.2 Initialize package.json with dependencies
- [x] 1.3 Configure tsconfig.json
- [x] 1.4 Configure next.config.mjs
- [x] 1.5 Configure postcss.config.mjs for Tailwind CSS 4
- [x] 1.6 Initialize shadcn/ui

### Phase 2: Base Infrastructure
- [x] 2.1 Create globals.css with Tailwind and CSS variables
- [x] 2.2 Create root layout.tsx with fonts and metadata
- [x] 2.3 Create sitemap.ts for SEO
- [x] 2.4 Create robots.ts for search engines
- [x] 2.5 Add Vercel Analytics

### Phase 3: OG Image System
- [x] 3.1 Create opengraph-image.tsx (1200x630)
- [x] 3.2 Create twitter-image.tsx (1200x600)
- [x] 3.3 Copy logo assets to public/images

### Phase 4: Core UI Components
- [x] 4.1 Install shadcn/ui components (button, card, badge)
- [x] 4.2 Create logo component
- [x] 4.3 Create header component
- [x] 4.4 Create footer component
- [x] 4.5 Create container and section components

### Phase 5: Landing Page Sections
- [x] 5.1 Create hero.tsx with animated gradient
- [x] 5.2 Create features.tsx with feature grid
- [x] 5.3 Create code-demo.tsx with syntax highlighting
- [x] 5.4 Create comparison.tsx (Storify vs Storybook)
- [x] 5.5 Create quick-start.tsx with terminal command
- [x] 5.6 Create cta.tsx

### Phase 6: Home Page Assembly
- [x] 6.1 Create app/page.tsx composing all sections
- [x] 6.2 Add scroll-triggered animations
- [x] 6.3 Add responsive breakpoints
- [x] 6.4 Test dark mode theming

### Phase 7: Documentation
- [x] 7.1 Update CLAUDE.md with apps/nextjs guidelines

## Affected Specs

- `[WEB.landing]` — ADDED (marketing website landing page)
