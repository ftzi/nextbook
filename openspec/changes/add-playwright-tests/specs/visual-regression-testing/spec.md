## ADDED Requirements

### Requirement: Playwright Test Infrastructure
The project SHALL have Playwright installed and configured in `apps/web` for end-to-end testing of the nextbook UI at `/ui`.

#### Scenario: Playwright configuration exists
- **WHEN** a developer checks the `apps/web` directory
- **THEN** a `playwright.config.ts` file SHALL exist with valid configuration
- **AND** the configuration SHALL specify `chromium` as the primary browser
- **AND** the base URL SHALL point to the local dev server

#### Scenario: Test command available
- **WHEN** a developer runs `bun test:e2e` from the project root
- **THEN** Playwright tests in `apps/web/tests/` SHALL execute
- **AND** test results SHALL be reported to the console

### Requirement: Sidebar Navigation Tests
The test suite SHALL verify sidebar navigation functionality.

#### Scenario: Sidebar renders story tree
- **WHEN** the sidebar navigation test runs
- **THEN** it SHALL verify the sidebar contains story categories
- **AND** it SHALL verify stories are listed within categories

#### Scenario: Sidebar navigation works
- **WHEN** a user clicks on a story in the sidebar
- **THEN** the test SHALL verify navigation to the story URL
- **AND** the test SHALL verify the story content loads

### Requirement: Story Viewer Tests
The test suite SHALL verify story viewer rendering and functionality.

#### Scenario: Story renders correctly
- **WHEN** the story viewer test navigates to a story
- **THEN** it SHALL verify the story component renders
- **AND** it SHALL capture a visual snapshot for regression detection

#### Scenario: Background toggle works
- **WHEN** the background toggle is clicked
- **THEN** the test SHALL verify the background style changes
- **AND** it SHALL verify toggle between default and striped modes

### Requirement: Controls Panel Tests
The test suite SHALL verify the controls panel for stories with Zod schemas.

#### Scenario: Controls render from schema
- **WHEN** a story with a Zod schema is displayed
- **THEN** the test SHALL verify controls render in the panel
- **AND** each schema field SHALL have a corresponding control

#### Scenario: Controls update component
- **WHEN** a control value is changed
- **THEN** the test SHALL verify the component re-renders with new props
- **AND** the rendered output SHALL reflect the control change

#### Scenario: Reset restores defaults
- **WHEN** controls are modified and reset is clicked
- **THEN** the test SHALL verify all controls return to default values
- **AND** the component SHALL render with default props

### Requirement: MSW Mocking Tests
The test suite SHALL verify MSW mocking functionality for stories with mocks.

#### Scenario: Mocks indicator visibility
- **WHEN** a story with mocks is displayed
- **THEN** the test SHALL verify the "Mocks" indicator badge is visible
- **AND** when a story without mocks is displayed
- **THEN** the indicator SHALL NOT be visible

#### Scenario: Mock data renders
- **WHEN** a story with mocks is displayed
- **THEN** the test SHALL verify the component renders with mocked data
- **AND** the mocked API response SHALL be used instead of real network calls

#### Scenario: Mock factory responds to controls
- **WHEN** a story with a mock factory function is displayed
- **AND** control values are changed
- **THEN** the test SHALL verify the mock response updates
- **AND** the component SHALL re-render with new mock data

#### Scenario: Error states render
- **WHEN** a story mocks an error response (500 status)
- **THEN** the test SHALL verify the component displays error UI

#### Scenario: Loading states render
- **WHEN** a story mocks an infinite delay
- **THEN** the test SHALL verify the component displays loading UI

### Requirement: Matrix Story Tests
The test suite SHALL verify matrix story rendering.

#### Scenario: Matrix grid renders
- **WHEN** a storyMatrix is displayed
- **THEN** the test SHALL verify the matrix grid layout renders
- **AND** all prop combinations SHALL be visible

#### Scenario: Combination labels correct
- **WHEN** a matrix view is displayed
- **THEN** each combination cell SHALL display the correct prop labels

### Requirement: Visual Regression Snapshots
The test suite SHALL capture visual snapshots for regression detection.

#### Scenario: Snapshots captured
- **WHEN** visual regression tests run
- **THEN** screenshot snapshots SHALL be captured for key UI states
- **AND** snapshots SHALL be stored in a consistent location

#### Scenario: Snapshot comparison
- **WHEN** tests run after UI changes
- **THEN** new screenshots SHALL be compared against baseline
- **AND** differences SHALL be reported as test failures
