# Add Playwright Visual Regression Tests

## Summary

Add Playwright-based visual regression testing infrastructure to `apps/web` for testing the nextbook `/ui` stories interface. This enables automated verification of the nextbook UI, including component rendering, controls panel, sidebar navigation, and the new MSW mocking features.

## Problem

Currently, there is no automated testing for the nextbook UI at `/ui`. This creates several issues:

1. **No regression detection** - UI changes can break without detection until manual review
2. **MSW mocking untested** - The new mocking feature (mocks indicator, mock application) has no automated tests
3. **Component stories untested** - Story rendering, controls panel, and sidebar interactions are verified only manually
4. **CI gap** - No way to verify UI correctness in continuous integration
5. **Refactoring risk** - Changes to nextbook components (shell, viewer, sidebar) risk undetected regressions

## Solution

Add Playwright to `apps/web` with visual regression tests covering:

1. **Core UI** - Sidebar navigation, story viewer, controls panel
2. **Component stories** - Verify components render correctly across variants
3. **MSW mocking** - Test mocks indicator visibility, mock application, error states, loading states
4. **Matrix stories** - Verify matrix view renders all combinations

**Key design decisions:**
- Tests live in `apps/web/tests/` alongside the marketing site
- Use Playwright's built-in screenshot comparison for visual regression
- Tests run against dev server (`bun dev`)
- CI integration via GitHub Actions
- Separate test command: `bun test:e2e`

## Scope

### In Scope
- Playwright installation and configuration in `apps/web`
- Visual regression tests for nextbook `/ui` pages
- Tests for sidebar navigation and story selection
- Tests for controls panel interactions
- Tests for MSW mocking feature (indicator, mock data rendering)
- Tests for matrix story view
- GitHub Actions workflow for CI
- Root package.json script update (`bun test:e2e`)

### Out of Scope
- Unit test changes (already covered by `bun test`)
- Performance testing
- Accessibility testing beyond basic Playwright assertions
- Testing the marketing site landing page (separate concern)

## Test Coverage Plan

### 1. Sidebar Navigation
- Renders story tree correctly
- Expands/collapses categories
- Navigates to story on click
- Highlights active story

### 2. Story Viewer
- Renders story component
- Displays story name in header
- Background toggle works (default/striped)

### 3. Controls Panel
- Renders controls from Zod schema
- Text input updates component
- Boolean toggle updates component
- Enum select updates component
- Reset button restores defaults

### 4. MSW Mocking
- Mocks indicator appears when mocks are active
- Mock data renders correctly in component
- Mock factory responds to control changes
- Error states render (500, 404)
- Loading state renders (infinite delay)

### 5. Matrix Stories
- Matrix grid renders
- All combinations visible
- Correct labels displayed

## Dependencies

- `@playwright/test` as dev dependency
- Playwright browsers (chromium, optionally firefox/webkit)

## Affected Areas

- `apps/web/package.json` - Add Playwright dependency and scripts
- `apps/web/playwright.config.ts` - New Playwright configuration
- `apps/web/tests/` - New test directory
- `package.json` (root) - Update `test:e2e` script
- `.github/workflows/` - Add CI workflow (optional, if CI exists)
- `biome.json` - Ignore test artifacts
