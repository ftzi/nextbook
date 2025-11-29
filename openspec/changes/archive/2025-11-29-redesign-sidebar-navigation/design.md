# Design: Component-Centric Tabbed Navigation

## Context

The fundamental insight: **Storybook's variant model is backwards.**

Developers don't think "I want to see Button/Primary". They think:
- "Show me the Button component"
- "What states does Button have?"
- "Let me play with Button's props"

The variant-as-navigation-item pattern forces an artificial mental model and creates UX friction.

## Goals / Non-Goals

**Goals:**
- One click to see a component (not click → expand → pick variant)
- Zero modules loaded until user navigates to a component
- All stories for a component visible at once (as tabs)
- Clear visual distinction between story types
- Blazing fast sidebar (no loading spinners, no expand/collapse jank)

**Non-Goals:**
- Preserving Storybook-style navigation (intentionally breaking from it)
- Virtualized lists (not needed with simpler sidebar)
- Search across story content (file-level search is sufficient)

## Decisions

### Decision 1: Tabs instead of tree expansion

**What:** Story exports become tabs on a single page, not expandable items in sidebar.

```
┌──────────────────────────────────────────────────────────────┐
│ Button                                                       │
├──────────────────────────────────────────────────────────────┤
│ [Default] [Secondary] [Outline] [Disabled] [Controlled⚡] [▦]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    [Story Content]                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Why:**
- Immediate visibility of all component stories
- One module load for all stories (not N loads for N variants)
- Familiar pattern (browser tabs, IDE tabs)
- No sidebar expansion = no loading spinners

### Decision 2: Sidebar shows only files

**What:** Sidebar becomes a simple file tree. No variant expansion.

```
Components/
  Button      ← click → /ui/button
  Card        ← click → /ui/card
Forms/
  Input       ← click → /ui/forms/input
  Checkbox    ← click → /ui/forms/checkbox
```

**Why:**
- Dramatically simpler code (remove all export-loading logic)
- Instant sidebar rendering (no async operations)
- Shorter sidebar (6 items vs 20+ with expanded variants)
- Clear 1:1 mapping: one file = one sidebar item

### Decision 3: URL structure compatibility

**What:** Keep existing URLs working:
- `/ui/button` → loads Button, shows first tab
- `/ui/button/default` → loads Button, selects "Default" tab
- `/ui/button/controlled` → loads Button, selects "Controlled" tab

**Why:**
- Deep links still work
- Browser history works as expected
- No migration needed for existing bookmarks

### Decision 4: Story type badges on tabs

**What:** Tabs show small icons indicating story type:
- No icon: Simple story (static render)
- ⚡ icon: Controlled story (has Zod schema, interactive controls)
- ▦ icon: Matrix story (shows all prop combinations)

**Why:**
- Instant recognition of what each story offers
- Matrix stories behave differently (grid view) - worth flagging
- Controlled stories have interactive panel - worth knowing

### Decision 5: Single module load per component

**What:** When navigating to `/ui/button`:
1. Load `button.story.tsx` module ONCE
2. Extract all story exports
3. Render tab bar with all exports
4. Render selected story content

**Why:**
- One network request instead of potentially many
- All stories immediately available for tab switching
- No loading state between tab switches

## Component Architecture

```
StoryPage
├── Loads module once
├── Extracts story exports
├── Determines active tab from URL
│
├── StoryTabs (new component)
│   ├── Tab for each story export
│   ├── Story type badge per tab
│   └── Click handler → URL navigation
│
└── StoryViewer (existing, minor changes)
    ├── Receives story object directly
    ├── Renders canvas
    └── Renders controls panel (if schema exists)
```

## Sidebar Simplification

**Current sidebar.tsx (complex):**
- TreeNodes → TreeNode → StoryFileNode | DirectoryNode
- StoryFileNode has useEffect to load exports
- Manages expansion state, loading state, export list

**New sidebar.tsx (simple):**
- TreeNodes → TreeNode → FileLink | DirectoryNode
- FileLink is just `<Link href={...}>{name}</Link>`
- No useEffect, no loading, no export discovery
- Directories can still expand/collapse (for organization)

## Visual Design

### Tab Bar
```css
/* Clean, minimal tabs with subtle indicators */
.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--border-subtle);
  padding: 0 16px;
}

.tab {
  padding: 8px 12px;
  border-radius: 6px 6px 0 0;
  color: var(--text-muted);
  transition: all 150ms;
}

.tab:hover {
  background: var(--bg-hover);
  color: var(--text);
}

.tabActive {
  color: var(--text);
  border-bottom: 2px solid var(--accent);
}

.tabBadge {
  margin-left: 4px;
  opacity: 0.6;
  font-size: 12px;
}
```

### Animation
- Tab switches: subtle fade transition on content
- Active tab indicator: smooth slide animation
- No jarring content shifts

## Migration

1. **No API changes** - `story()`, `storyMatrix()`, `createStoryRegistry()` unchanged
2. **No user migration** - existing story files work exactly the same
3. **Visual regression tests** - will need updating for new layout
4. **URLs preserved** - existing links continue to work

## Risks / Trade-offs

**Risk:** Users who liked expanding variants in sidebar may be confused
- **Mitigation:** The new pattern is more intuitive. Brief "what's new" could help.

**Risk:** Very long tab bars for files with many stories
- **Mitigation:** Horizontal scroll with fade indicators. Rare in practice.

**Risk:** Losing the "at-a-glance all variants" view in sidebar
- **Mitigation:** Tab bar provides this even better (actually visible, not nested)

## Open Questions

1. ~~Should sidebar collapse folders by default?~~
   - **Decision:** Yes, start collapsed. Cleaner initial view.

2. Should we add keyboard shortcuts for tab navigation?
   - **Recommendation:** Yes, in a follow-up. Arrow keys or number keys.

3. What happens with 20+ stories in one file?
   - **Recommendation:** Horizontal scroll. This is an edge case - most files have 2-8 stories.
