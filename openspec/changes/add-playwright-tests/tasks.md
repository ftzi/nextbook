# Implementation Tasks

## 1. Playwright Setup
- [x] 1.1 Install `@playwright/test` in `apps/web`
- [x] 1.2 Run `npx playwright install chromium` to install browser
- [x] 1.3 Create `apps/web/playwright.config.ts` with base configuration
- [x] 1.4 Add `apps/web/tests/` directory for test files
- [x] 1.5 Add test scripts to `apps/web/package.json` (`test:e2e`, `test:e2e:ui`)
- [x] 1.6 Update root `package.json` to point `test:e2e` to `apps/web`
- [x] 1.7 Add Playwright artifacts to `biome.json` ignore list (`**/test-results`, `**/playwright-report`)

## 2. Core UI Tests
- [x] 2.1 Create `apps/web/tests/sidebar.e2e.ts` for sidebar navigation tests
- [x] 2.2 Test sidebar renders with story categories
- [x] 2.3 Test sidebar category expand/collapse
- [x] 2.4 Test sidebar story selection navigates correctly
- [x] 2.5 Test active story highlighting

## 3. Story Viewer Tests
- [x] 3.1 Create `apps/web/tests/story-viewer.e2e.ts`
- [x] 3.2 Test story renders in viewer area
- [x] 3.3 Test story header displays correct name
- [x] 3.4 Test background toggle (default/striped)
- [x] 3.5 Visual snapshot of rendered story

## 4. Controls Panel Tests
- [x] 4.1 Create `apps/web/tests/controls-panel.e2e.ts`
- [x] 4.2 Test controls panel renders for story with schema
- [x] 4.3 Test text input control updates component
- [x] 4.4 Test boolean toggle control updates component
- [x] 4.5 Test enum select control updates component
- [x] 4.6 Test size select control updates component
- [x] 4.7 Test reset button restores default values
- [x] 4.8 Visual snapshot of controls panel

## 5. MSW Mocking Tests
- [x] 5.1 Create `apps/web/tests/mocking.e2e.ts`
- [x] 5.2 Test mocks indicator appears for story with mocks
- [x] 5.3 Test mocks indicator hidden for story without mocks
- [x] 5.4 Test mock data renders correctly in component (UserCard example)
- [x] 5.5 Test mock factory responds to control changes
- [x] 5.6 Test error state renders (500 status)
- [x] 5.7 Test not found state renders (404 status)
- [x] 5.8 Test loading state renders (infinite delay)
- [x] 5.9 Visual snapshot of mocked component

## 6. Matrix Story Tests
- [x] 6.1 Create `apps/web/tests/matrix.e2e.ts`
- [x] 6.2 Test matrix grid renders for storyMatrix
- [x] 6.3 Test all prop combinations are visible
- [x] 6.4 Test combination labels are correct
- [x] 6.5 Visual snapshot of matrix view

## 7. CI Integration (Optional)
- [ ] 7.1 Create `.github/workflows/e2e.yml` if CI exists
- [ ] 7.2 Configure Playwright in CI (install deps, run tests)
- [ ] 7.3 Upload test artifacts on failure

## 8. Documentation
- [x] 8.1 Update CLAUDE.md with e2e test instructions
- [x] 8.2 Document test patterns and conventions

## 9. Validation
- [x] 9.1 Run `bun ok` to verify no lint/type errors
- [x] 9.2 Run `bun test:e2e` to verify all tests pass
- [x] 9.3 Verify visual snapshots are captured
