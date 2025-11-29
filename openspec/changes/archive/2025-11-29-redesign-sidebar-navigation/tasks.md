# Tasks: Component-Centric Tabbed Navigation

## 1. Simplify Sidebar
- [ ] 1.1 Remove `StoryFileNode` component entirely
- [ ] 1.2 Remove export loading useEffect and related state
- [ ] 1.3 Replace with simple `FileLink` component (just a `<Link>`)
- [ ] 1.4 Keep `DirectoryNode` for folder collapse/expand
- [ ] 1.5 Default folders to collapsed state
- [ ] 1.6 Update sidebar styles (remove variant-related styles)

## 2. Create Story Tabs Component
- [ ] 2.1 Create `story-tabs.tsx` with tab bar UI
- [ ] 2.2 Create `story-tabs.module.css` with modern tab styling
- [ ] 2.3 Add story type badges (controlled ⚡, matrix ▦)
- [ ] 2.4 Handle tab click → URL navigation
- [ ] 2.5 Support horizontal scroll for many tabs

## 3. Update Story Page for Tabbed View
- [ ] 3.1 Refactor to load module once on navigation
- [ ] 3.2 Extract all story exports from loaded module
- [ ] 3.3 Determine active tab from URL (or default to first)
- [ ] 3.4 Render StoryTabs component
- [ ] 3.5 Pass active story to StoryViewer
- [ ] 3.6 Handle "no export specified" → show first tab (not placeholder)

## 4. Update Story Viewer
- [ ] 4.1 Accept story object directly (optional alternative to loader)
- [ ] 4.2 Remove redundant module loading when story passed directly
- [ ] 4.3 Ensure controls panel still works with passed story

## 5. Polish & Animation
- [ ] 5.1 Add smooth tab indicator slide animation
- [ ] 5.2 Add subtle content fade on tab switch
- [ ] 5.3 Ensure dark mode looks great
- [ ] 5.4 Test and polish responsive behavior

## 6. Testing & Verification
- [ ] 6.1 Run `bun ok` and fix any type/lint issues
- [ ] 6.2 Manual test: verify no modules load on initial page
- [ ] 6.3 Manual test: verify URL deep links work
- [ ] 6.4 Manual test: verify all story types render correctly

## Dependencies

- Task 1.x can start immediately
- Task 2.x can start immediately (parallel with 1.x)
- Task 3.x depends on 2.x completion (needs StoryTabs)
- Task 4.x can start after 3.x (may not be needed if we keep loader pattern)
- Task 5.x after core implementation complete
- Task 6.x runs last
