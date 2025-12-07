# E2E Testing Infrastructure [NEX.e2e]

Playwright-based visual regression testing for the nextbook UI. Tests run against the example app at `/ui` to verify the nextbook shell, sidebar, story viewer, and controls panel work correctly.

## Design Decisions

Tests live in `apps/web/e2e/` alongside the marketing site since that's where the nextbook `/ui` demo lives. We use Playwright's built-in screenshot comparison for visual regression. Tests run via `bun e2e` which starts the dev server automatically via Playwright's webServer config.

---

## Test Infrastructure [NEX.e2e.infrastructure]

Playwright is configured and runnable.

### Scenario: Playwright configuration [NEX.e2e.infrastructure.config]
Testing: unit

- WHEN a developer checks `apps/web`
- THEN `playwright.config.ts` exists with valid configuration
- AND chromium is the primary browser
- AND baseURL points to localhost dev server

### Scenario: Test command available [NEX.e2e.infrastructure.command]
Testing: unit

- WHEN developer runs `bun e2e` from project root
- THEN Playwright tests execute
- AND dev server starts automatically
- AND results report to console

---

## Sidebar Tests [NEX.e2e.sidebar]

Tests verify sidebar navigation.

### Scenario: Sidebar renders story tree [NEX.e2e.sidebar.renders]
Testing: e2e

- WHEN sidebar test runs
- THEN sidebar contains story files
- AND files are organized by folder structure

### Scenario: Sidebar navigation works [NEX.e2e.sidebar.navigation]
Testing: e2e

- WHEN a story file is clicked in sidebar
- THEN URL navigates to the story
- AND story content loads in viewer

---

## Story Viewer Tests [NEX.e2e.story-viewer]

Tests verify story rendering and viewer controls.

### Scenario: Story renders correctly [NEX.e2e.story-viewer.renders]
Testing: e2e

- WHEN navigating to a story
- THEN the component renders in the viewer
- AND visual snapshot matches baseline

### Scenario: Background toggle [NEX.e2e.story-viewer.background]
Testing: e2e

- WHEN background toggle is clicked
- THEN background style changes
- AND toggles between transparent and checkered modes

---

## Controls Panel Tests [NEX.e2e.controls-panel]

Tests verify the Zod-generated controls.

### Scenario: Controls render from schema [NEX.e2e.controls-panel.renders]
Testing: e2e

- WHEN a story with Zod schema is displayed
- THEN controls render in the panel
- AND each schema field has a corresponding control

### Scenario: Controls update component [NEX.e2e.controls-panel.updates]
Testing: e2e

- WHEN a control value changes
- THEN the component re-renders
- AND rendered output reflects new props

### Scenario: Reset restores defaults [NEX.e2e.controls-panel.reset]
Testing: e2e

- WHEN controls are modified and reset clicked
- THEN all controls return to defaults
- AND component renders with initial props

---

## MSW Mocking Tests [NEX.e2e.mocking]

Tests verify MSW mocking for stories with API dependencies.

### Scenario: Mocks indicator visible [NEX.e2e.mocking.indicator]
Testing: e2e

- WHEN a story with mocks is displayed
- THEN "Mocks" indicator badge is visible
- AND indicator hidden for stories without mocks

### Scenario: Mock data renders [NEX.e2e.mocking.data]
Testing: e2e

- WHEN a story with mocks is displayed
- THEN component renders with mocked data
- AND real network calls are intercepted

### Scenario: Mock factory responds to controls [NEX.e2e.mocking.factory]
Testing: e2e

- WHEN a story with mock factory is displayed
- AND control values change
- THEN mock response updates accordingly

### Scenario: Error states render [NEX.e2e.mocking.error]
Testing: e2e

- WHEN a story mocks error response (500)
- THEN component displays error UI

### Scenario: Loading states render [NEX.e2e.mocking.loading]
Testing: e2e

- WHEN a story mocks infinite delay
- THEN component displays loading UI

---

## Matrix Story Tests [NEX.e2e.matrix]

Tests verify matrix view rendering.

### Scenario: Matrix grid renders [NEX.e2e.matrix.renders]
Testing: e2e

- WHEN a storyMatrix is displayed
- THEN matrix grid layout renders
- AND all prop combinations are visible

### Scenario: Combination labels correct [NEX.e2e.matrix.labels]
Testing: e2e

- WHEN matrix view is displayed
- THEN each cell shows correct prop labels

---

## Visual Regression [NEX.e2e.visual]

Tests capture and compare screenshots.

### Scenario: Snapshots captured [NEX.e2e.visual.capture]
Testing: e2e

- WHEN visual regression tests run
- THEN screenshots are captured for key UI states
- AND stored in `.snapshots/` directory

### Scenario: Snapshot comparison [NEX.e2e.visual.compare]
Testing: e2e

- WHEN tests run after UI changes
- THEN new screenshots compare against baseline
- AND differences report as test failures
