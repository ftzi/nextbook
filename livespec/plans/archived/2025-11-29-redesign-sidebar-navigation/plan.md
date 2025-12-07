# Plan: Redesign Navigation to Component-Centric Tabs

## Summary

Redesign sidebar navigation from "variants as navigation items" (Storybook-style) to "components as pages with tabs". Sidebar shows only story files; story page shows all exports as tabs.

## Why

The original Storybook-style navigation had fundamental problems:

1. **Performance bug**: All story modules load on page mount because tree nodes default to `isOpen=true`
2. **UX friction**: Too many steps to navigate (click folder → expand → find variant → click)
3. **Long lists**: Deeply nested variants create endless scrolling
4. **Wrong mental model**: Developers think "I want to see Button", not "Button/Primary"

## What Changes

- **BREAKING**: Sidebar no longer shows individual story variants
- **BREAKING**: Navigation model shifts from "variants as pages" to "components as pages with tabs"
- Sidebar shows only story files (one entry per `.story.tsx`)
- Story page shows ALL exports from a file as tabs
- Tabs have badges indicating story type (controlled, matrix)
- Click component → see everything about it immediately

**Visual Change:**

```
Before (Storybook-style):    After (Component-centric):
▼ Button                     Sidebar:          Page:
    Default                  ┌──────────┐      ┌─────────────────────────┐
    Secondary                │ Button   │  →   │ [Default][Ctrl⚡][▦]    │
    Outline                  │ Card     │      │ ┌───────────────────┐   │
    Disabled                 │ Input    │      │ │  [Rendered Story] │   │
    Controlled               └──────────┘      │ └───────────────────┘   │
    AllVariants                                └─────────────────────────┘
```

## Tasks

### Phase 1: Simplify Sidebar
- [x] 1.1 Remove `StoryFileNode` component entirely
- [x] 1.2 Remove export loading useEffect and related state
- [x] 1.3 Replace with simple `FileLink` component
- [x] 1.4 Keep `DirectoryNode` for folder collapse/expand
- [x] 1.5 Default folders to collapsed state
- [x] 1.6 Update sidebar styles

### Phase 2: Create Story Tabs
- [x] 2.1 Create tab bar UI in story viewer
- [x] 2.2 Add story type badges (controlled, matrix)
- [x] 2.3 Handle tab click → URL navigation
- [x] 2.4 Support horizontal scroll for many tabs

### Phase 3: Update Story Page
- [x] 3.1 Refactor to load module once on navigation
- [x] 3.2 Extract all story exports from loaded module
- [x] 3.3 Determine active tab from URL
- [x] 3.4 Render tabs component
- [x] 3.5 Handle "no export specified" → show first tab

### Phase 4: Polish
- [x] 4.1 Add smooth tab indicator animation
- [x] 4.2 Ensure dark mode looks great
- [x] 4.3 Test responsive behavior

## Affected Specs

- `[NEX.sidebar]` — ADDED (component-centric sidebar)
- `[NEX.sidebar.tabs]` — ADDED (tabbed story view)
- `[NEX.sidebar.badges]` — ADDED (story type badges)
