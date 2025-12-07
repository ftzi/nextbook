# Marketing Website Project

## Overview

**Codebase:** `apps/web/`

The marketing website for nextbook.dev. It showcases the library's features, provides documentation, and includes the nextbook `/ui` stories for dogfooding and testing.

## Domain Knowledge

### Core Concepts

- **Landing page** — Main marketing page with hero, features, comparison, quick start
- **Nextbook stories at /ui** — Dogfooding: the website uses nextbook to show its own component stories
- **Dynamic OG images** — Auto-generated social share images using Next.js ImageResponse

### Tech Stack

- Next.js 16 with React 19
- Tailwind CSS 4 with shadcn/ui components
- Framer Motion for animations
- Vercel Analytics

### Design Philosophy

- Dark mode default (matches developer tooling aesthetic)
- Brand gradient: cyan (#06B6D4) → purple (#7C3AED) → pink (#EC4899)
- Polished, modern UI with micro-interactions
- Mobile-first responsive design

## Gotchas

- Uses Tailwind CSS (unlike the nextbook package which uses CSS Modules)
- The `/ui` layout should only contain `<NextbookShell>`, not `<html>/<body>`
- Screenshots in landing page are placeholders that need capturing

## Related Specs

- [Landing Page](specs/landing/spec.md) — Marketing page behavior
