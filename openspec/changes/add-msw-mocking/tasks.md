# Tasks

## Phase 1: Core MSW Integration

### 1. Add mocks types to story API
- [ ] Update `types.ts` with mock-related types (`StoryMocks`, updated `StoryConfig`, `Story`)
- [ ] Import `RequestHandler` type from MSW (type-only import)
- [ ] Update `story.ts` to include `mocks` in returned story object
- [ ] Add unit tests for story creation with mocks

### 2. Create MSW worker management hook
- [ ] Create `src/hooks/use-msw.ts` with worker initialization logic
- [ ] Implement dynamic import of `msw/browser` (graceful fallback when not installed)
- [ ] Handle worker start with `onUnhandledRequest: 'bypass'`
- [ ] Export hook for use in NextbookShell
- [ ] Add unit tests for hook behavior

### 3. Integrate MSW in NextbookShell
- [ ] Initialize MSW worker on shell mount using the hook
- [ ] Store worker reference for use by StoryViewer
- [ ] Pass worker reference via context or prop drilling
- [ ] Handle cleanup on unmount

### 4. Apply mocks in StoryViewer
- [ ] Receive worker reference from shell
- [ ] Reset handlers when story changes
- [ ] Compute mocks (static array or factory function with control values)
- [ ] Apply handlers with `worker.use(...handlers)`
- [ ] Re-apply mocks when control values change (for factory functions)
- [ ] Track mock status (active/inactive) for UI indicator

### 5. Add mock status UI indicator
- [ ] Add "Mocks Active" badge to story viewer header
- [ ] Style with existing design tokens
- [ ] Add tooltip explaining mock behavior
- [ ] Only show when mocks are active

## Phase 2: Documentation

### 6. Update README with mocking section
- [ ] Add "Mocking" section to README.md
- [ ] Document prop-based mocking (already possible)
- [ ] Document MSW-based mocking with examples
- [ ] Include MSW setup instructions (`npm install msw`, `npx msw init public`)
- [ ] Document mock factories
- [ ] Document error/loading state testing patterns
- [ ] Link to MSW docs and @anatine/zod-mock

### 7. Update marketing website
- [ ] Add mocking to features list in `apps/web/components/landing/features.tsx`
- [ ] Add code example to code demo section
- [ ] Update comparison table if relevant

## Phase 3: Testing & Validation

### 8. Add example stories with mocks
- [ ] Create `apps/example/app/ui/stories/mocking.story.tsx`
- [ ] Include examples: static mocks, mock factory, error state, loading state
- [ ] Ensure examples work correctly in development

### 9. Run full validation
- [ ] Run `bun ok` to verify types and linting
- [ ] Run `bun test` to verify unit tests pass

## Dependencies

- Task 2 depends on Task 1 (types needed for hook)
- Task 3 depends on Task 2 (hook needed in shell)
- Task 4 depends on Task 3 (worker reference needed)
- Task 5 depends on Task 4 (mock status tracking)
- Tasks 6-7 can run in parallel with Tasks 1-5
- Tasks 8-9 depend on all previous tasks
