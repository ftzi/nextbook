# Plan: Add MSW Mocking Support

## Summary

Add optional MSW (Mock Service Worker) integration to storify, allowing developers to mock API endpoints when viewing component stories.

## Why

When developers view component stories at `/ui`, components that make API calls still hit real endpoints. This creates friction:

- Authentication barriers — components requiring auth can't be tested in isolation
- Environment dependencies — APIs might not exist locally or in CI
- Unpredictable data — real data varies, making visual testing inconsistent
- Side effects — real calls might modify production data

## What Changes

- Add `mocks` property to `story()` accepting MSW handlers
- MSW worker lifecycle management in StorifyShell/StoryViewer
- UI indicator showing "Mocks Active" status
- Documentation in README and marketing website

## Design Decisions

### Decision: MSW as Peer Dependency

**Choice:** MSW is a peer dependency, not bundled
**Alternatives:** Bundle MSW, create custom mocking solution
**Rationale:** Users install and set up MSW themselves, maintaining our zero-dependencies principle

### Decision: No Re-exports

**Choice:** Users import MSW utilities directly from `msw`
**Alternatives:** Re-export common utilities from storify
**Rationale:** Avoids version conflicts and keeps storify focused

### Decision: Mock Factories

**Choice:** Mocks can be functions that receive control values
**Rationale:** Allows mocks to respond to interactive control changes

## Tasks

### Phase 1: Core MSW Integration

- [x] Update `types.ts` with mock-related types
- [x] Update `story.ts` to include `mocks` in returned story object
- [x] Create `src/hooks/msw-context.tsx` with worker initialization
- [x] Integrate MSW in StorifyShell
- [x] Apply mocks in StoryViewer
- [x] Add mock status UI indicator

### Phase 2: Documentation

- [x] Update README with mocking section
- [x] Update marketing website features

### Phase 3: Testing

- [x] Add example stories with mocks in apps/nextjs (user-card.story.tsx)
- [x] Run `bun ok` to verify

## Affected Specs

- `[STO.story-api]` — MODIFIED (add mocks property)
- `[STO.msw-mocking]` — ADDED (new capability)
