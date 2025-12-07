# Landing Page *[WEB-landing]*

The landing page at nextbook.dev is the primary entry point for developers discovering nextbook. It needs to quickly communicate the value proposition and make it easy to get started.

## Design Decisions

The landing page targets developers, so it shows real code examples, compares to familiar tools (Storybook), gets to the point quickly, and provides copy-paste quick start.

Dark mode is default because developers spend most time in dark IDEs, so it feels natural and reduces eye strain when switching between docs and code.

---

## Hero Section *[WEB-landing.hero]*

The hero communicates the core value proposition.

### Scenario: Value proposition visible *[WEB-landing.hero.value-prop]*
Testing: e2e

- WHEN page loads
- THEN the headline communicates "zero-config component stories"
- AND the subheadline mentions Next.js specifically
- AND a CTA button links to quick start or GitHub

### Scenario: Hero screenshot *[WEB-landing.hero.screenshot]*
Testing: e2e

- WHEN viewing the hero section
- THEN a screenshot/preview of nextbook UI is visible
- AND it shows a realistic component story view

---

## Features Section *[WEB-landing.features]*

The features section highlights key differentiators.

### Scenario: Feature cards *[WEB-landing.features.cards]*
Testing: e2e

- WHEN viewing features section
- THEN key features are displayed as cards
- AND each has an icon, title, and description
- AND features include: zero-config, Zod controls, matrix view, dark mode

---

## Comparison Section *[WEB-landing.comparison]*

The comparison shows advantages over Storybook.

### Scenario: Comparison table *[WEB-landing.comparison.table]*
Testing: e2e

- WHEN viewing comparison section
- THEN a table compares nextbook vs Storybook
- AND highlights: dependencies count, config files, setup time

---

## Quick Start Section *[WEB-landing.quickstart]*

The quick start enables immediate adoption.

### Scenario: Installation command *[WEB-landing.quickstart.install]*
Testing: e2e

- WHEN viewing quick start
- THEN the npx/bunx command is displayed
- AND it's easy to copy

### Scenario: Code example *[WEB-landing.quickstart.code]*
Testing: e2e

- WHEN viewing quick start
- THEN a minimal story example is shown
- AND the code is syntax highlighted
- AND it demonstrates the `story()` function

---

## Responsive Design *[WEB-landing.responsive]*

The landing page works on all device sizes.

### Scenario: Mobile layout *[WEB-landing.responsive.mobile]*
Testing: e2e

- WHEN viewing on mobile (< 768px)
- THEN all sections are readable
- AND navigation collapses appropriately
- AND no horizontal scroll occurs

### Scenario: Desktop layout *[WEB-landing.responsive.desktop]*
Testing: e2e

- WHEN viewing on desktop (> 1024px)
- THEN full layout is displayed
- AND content is well-spaced
- AND screenshots are prominently visible

---

## SEO *[WEB-landing.seo]*

The landing page is optimized for search engines.

### Scenario: Meta tags *[WEB-landing.seo.meta]*
Testing: unit

- WHEN page is crawled
- THEN title and description are present
- AND Open Graph tags are set
- AND canonical URL is correct

### Scenario: Dynamic OG image *[WEB-landing.seo.og-image]*
Testing: unit

- WHEN page is shared on social media
- THEN a branded OG image is displayed
- AND it includes the nextbook logo and tagline
