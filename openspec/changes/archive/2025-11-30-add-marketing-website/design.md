# Design: Marketing Website Architecture

## Context

Creating a world-class marketing website for nextbook.dev that matches the quality of sites like Vercel, Next.js, Storybook, and Chromatic. The site needs to be:
- Visually stunning with modern design patterns
- Fast and performant (static generation where possible)
- SEO-optimized for discoverability
- Maintainable and consistent with the monorepo patterns

## Goals / Non-Goals

### Goals
- Create a beautiful, professional landing page that converts visitors
- Implement OG images for social sharing
- Set up proper SEO infrastructure
- Use modern animation patterns (Framer Motion)
- Follow shadcn/ui patterns for component consistency
- Keep the site simple and focused (marketing + basic docs)

### Non-Goals
- Full documentation site (MDX, versioning, search) - future work
- User accounts or authentication
- Backend API or database
- Blog system - future work
- Internationalization (i18n) - future work

## Decisions

### 1. Component Library: shadcn/ui + Tailwind CSS 4

**Decision:** Use shadcn/ui with new-york style and Tailwind CSS 4

**Why:**
- shadcn/ui provides high-quality, accessible components
- Tailwind CSS 4 with CSS variables enables easy theming
- Components are copy-pasted, not installed - full control
- Consistent with turbostack patterns

**Configuration:**
```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide"
}
```

### 2. Animation Library: Framer Motion

**Decision:** Use Framer Motion for animations

**Why:**
- Production-ready, battle-tested
- Excellent React integration
- Supports gesture-based animations
- Easy scroll-triggered animations
- Great developer experience

**Use Cases:**
- Hero section gradient animations
- Feature card hover effects
- Scroll-reveal animations
- Page transitions
- Interactive code demos

### 3. OG Image Generation

**Decision:** Use Next.js ImageResponse API (like turbostack)

**Why:**
- Built into Next.js, no external service needed
- Dynamic image generation at edge
- Can include nextbook logo and custom text
- Supports both OpenGraph and Twitter card images

**Structure:**
```
apps/web/
├── opengraph-image.tsx      # Default OG image
├── twitter-image.tsx        # Twitter card (different dimensions)
└── lib/opengraph/
    ├── defaults.ts          # Shared OG metadata
    ├── og-params.ts         # URL param encoding
    └── og-wrapper.tsx       # Reusable OG component
```

### 4. SEO Infrastructure

**Decision:** Programmatic sitemap.ts and robots.ts

**Why:**
- Type-safe route definitions
- Automatic sitemap generation
- Easy to maintain as pages grow
- Consistent with Next.js conventions

**Files:**
```
apps/web/
├── sitemap.ts               # MetadataRoute.Sitemap
├── robots.ts                # MetadataRoute.Robots
└── lib/public-routes.ts     # Centralized route definitions
```

### 5. Project Structure

**Decision:** Flat component structure with feature folders

```
apps/web/
├── app/
│   ├── layout.tsx           # Root layout (fonts, metadata)
│   ├── page.tsx             # Landing page (home route)
│   ├── globals.css          # Tailwind imports
│   ├── opengraph-image.tsx
│   ├── twitter-image.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── docs/                # Future: docs pages
│       └── [...slug]/
│           └── page.tsx
├── components/
│   ├── landing/             # Landing page sections
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── code-demo.tsx
│   │   ├── comparison.tsx
│   │   ├── testimonials.tsx
│   │   └── cta.tsx
│   ├── ui/                  # shadcn components (local)
│   └── shared/              # Shared components
│       ├── header.tsx
│       ├── footer.tsx
│       └── logo.tsx
├── lib/
│   ├── opengraph/
│   ├── public-routes.ts
│   └── utils.ts
├── public/
│   └── images/
├── components.json          # shadcn config
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

### 6. Environment Variables

**Decision:** Use @t3-oss/env-nextjs for type-safe env vars

```typescript
// lib/env.ts
export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_URL: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
})
```

### 7. Typography and Design Tokens

**Decision:** Geist font family (same as Vercel/Next.js sites)

**Why:**
- Modern, professional appearance
- Excellent readability
- Available via next/font/google
- Includes mono variant for code

**Design Tokens:**
- Primary color: A vibrant gradient (purple to blue, matching logo)
- Background: Dark mode default, light mode support
- Spacing: Consistent 4px grid
- Border radius: Rounded corners (0.5rem default)

## Risks / Trade-offs

### Risk: Scope Creep
- **Mitigation:** Start with landing page only, defer docs/blog to future proposals

### Risk: Animation Performance
- **Mitigation:** Use `will-change`, lazy load heavy animations, test on low-end devices

### Risk: Design Consistency
- **Mitigation:** Create design tokens file, use shadcn defaults, document patterns

### Trade-off: Tailwind in Web vs CSS Modules in nextbook
- The marketing site (apps/web) uses Tailwind
- The nextbook package uses CSS Modules (for user isolation)
- This is intentional: the package needs to work in any user's setup

## Resolved Questions

1. **Logo Assets:** ✅ Available at `/assets/` - `logo.svg`, `logo-animated.svg`, `icon.svg`
   - Beautiful gradient design (cyan → purple → pink)
   - Icon: 45° rotated diamond outline
   - Full logo: Diamond + "Nextbook" text with gradient
2. **Analytics:** ✅ Using Vercel Analytics (@vercel/analytics)
3. **Domain:** ✅ Purchased at Porkbun - DNS managed there
4. **Deployment:** Vercel (configure via Vercel dashboard, link to GitHub repo)

## Screenshot Placeholders

The website will include placeholder areas for screenshots. Here's what to capture:

### Hero Section
- **hero-screenshot.png** (1200x800): Full nextbook UI showing sidebar + story viewer
  - Show a component story with controls panel visible
  - Dark mode preferred for visual impact

### Features Section
- **feature-zod-controls.png** (600x400): Controls panel with various input types
  - Show text input, toggle, dropdown controls
  - Demonstrate the auto-generated nature from Zod schemas

- **feature-story-matrix.png** (800x500): Matrix view with multiple prop combinations
  - Show a button component in various states (primary/secondary × sizes)
  - Highlight the grid layout

### Code Demo Section
- **code-demo-preview.png** (800x600): Side-by-side code + rendered component
  - Left: Story code with syntax highlighting
  - Right: Live component preview

### Comparison Section
- **comparison-setup.gif** (600x400): Quick GIF showing `npx nextbook` setup speed
  - Terminal running the init command
  - Files being created
  - Browser showing result

### Quick Start Section
- **quickstart-terminal.png** (700x200): Clean terminal showing the CLI command
  - `npx nextbook` with success output

## References

- Vercel.com design patterns: https://vercel.com
- Next.js.org design patterns: https://nextjs.org
- Storybook.js.org: https://storybook.js.org
- Chromatic.com: https://chromatic.com
- shadcn/ui: https://ui.shadcn.com
- Framer Motion: https://framer.com/motion
