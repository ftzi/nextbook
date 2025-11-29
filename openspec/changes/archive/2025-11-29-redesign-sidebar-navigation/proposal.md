# Change: Redesign Navigation to Component-Centric Tabs

## Why

The current Storybook-style "variants as navigation items" pattern has fundamental problems:

1. **Performance bug**: All story modules load on page mount because tree nodes default to `isOpen=true`
2. **UX friction**: Navigating to a component requires: click folder → expand → find variant → click. Too many steps.
3. **Long lists**: Deeply nested variants create endless scrolling in the sidebar
4. **Wrong mental model**: Developers think "I want to see the Button component", not "I want to see Button/Primary"

## What Changes

- **BREAKING**: Sidebar no longer shows individual story variants
- **BREAKING**: Navigation model shifts from "variants as pages" to "components as pages with tabs"
- Sidebar shows only story files (one entry per `.story.tsx`)
- Story page shows ALL exports from a file as tabs
- Tabs have badges indicating story type (simple, controlled, matrix)
- Click component → see everything about it immediately

## Visual Change

**Before (Storybook-style):**
```
▼ Button
    Default
    Secondary
    Outline
    Disabled
    Controlled
    AllVariants
```

**After (Component-centric):**
```
Sidebar:          Page:
┌──────────┐      ┌─────────────────────────────────────────┐
│ Button   │  →   │ Button                                  │
│ Card     │      │ [Default][Secondary][Outline][Ctrl⚡][▦] │
│ Input    │      │ ┌─────────────────────────────────────┐ │
└──────────┘      │ │        [Rendered Story]             │ │
                  │ └─────────────────────────────────────┘ │
                  │ Controls: ...                           │
                  └─────────────────────────────────────────┘
```

## Impact

- Affected specs: New `sidebar-navigation` capability
- Affected code:
  - `packages/nextbook/src/components/sidebar.tsx` - Major simplification
  - `packages/nextbook/src/components/story-page.tsx` - Add tabbed viewing
  - `packages/nextbook/src/components/story-viewer.tsx` - Minor adjustments
  - New: `packages/nextbook/src/components/story-tabs.tsx` - Tab bar component
- URL structure preserved: `/ui/button/default` still works (selects that tab)
