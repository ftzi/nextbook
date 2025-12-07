# Plan: Add Playwright Visual Regression Tests

## Summary

Add Playwright-based visual regression testing infrastructure to `apps/nextjs` for testing the storify `/ui` stories interface. This enables automated verification of the storify UI, including component rendering, controls panel, sidebar navigation, and MSW mocking features.

## Why

No automated testing existed for the storify UI at `/ui`. This created issues:
- No regression detection for UI changes
- MSW mocking untested
- Component stories verified only manually
- No CI verification
- Refactoring risk without automated checks

## What Changes

- Added `@playwright/test` to `apps/nextjs`
- Created `playwright.config.ts` with chromium browser
- Added e2e tests in `apps/nextjs/e2e/` covering:
  - Sidebar navigation (`sidebar.e2e.ts`)
  - Story viewer (`story-viewer.e2e.ts`)
  - Controls panel (`controls-panel.e2e.ts`)
  - MSW mocking (`mocking.e2e.ts`)
  - Matrix stories (`matrix.e2e.ts`)
  - Marketing screenshots (`marketing-screenshots.e2e.ts`)
- Added `bun e2e` command at root
- Updated biome.json to ignore test artifacts

## Tasks

### Phase 1: Playwright Setup
- [x] 1.1 Install `@playwright/test` in `apps/nextjs`
- [x] 1.2 Run `npx playwright install chromium`
- [x] 1.3 Create `apps/nextjs/playwright.config.ts`
- [x] 1.4 Add `apps/nextjs/e2e/` directory
- [x] 1.5 Add test scripts to `apps/nextjs/package.json`
- [x] 1.6 Update root `package.json` with `bun e2e`
- [x] 1.7 Add Playwright artifacts to biome.json ignore

### Phase 2: Core UI Tests
- [x] 2.1 Create sidebar navigation tests
- [x] 2.2 Create story viewer tests
- [x] 2.3 Create controls panel tests

### Phase 3: Feature Tests
- [x] 3.1 Create MSW mocking tests
- [x] 3.2 Create matrix story tests

### Phase 4: CI Integration
- [ ] 4.1 Create `.github/workflows/e2e.yml` (optional - deferred)
- [ ] 4.2 Configure CI playwright setup (optional - deferred)

### Phase 5: Validation
- [x] 5.1 Run `bun ok` - passed
- [x] 5.2 Run `bun e2e` - all tests pass
- [x] 5.3 Visual snapshots captured

## Affected Specs

- `[NEX.e2e]` — ADDED (visual regression testing infrastructure)
