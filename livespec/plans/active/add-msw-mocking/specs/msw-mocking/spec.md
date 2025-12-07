# MSW Mocking *[NEX-msw-mocking]*

MSW (Mock Service Worker) integration allows developers to mock API responses when viewing component stories. This enables testing components that fetch data without requiring real backends.

## Design Decisions

MSW intercepts requests at the network level, not by mocking fetch. This means it works with any HTTP client (fetch, axios, etc.), components use real code paths, and no special test-only code is needed in components.

MSW is a peer dependency — projects that don't need mocking don't pay the cost. The `mocks` property is simply ignored if MSW isn't installed.

---

## Mocks Property on Story *[NEX-msw-mocking.property]*

The `story()` function accepts an optional `mocks` property.

### Scenario: Story with static mocks *[NEX-msw-mocking.property.static]*
Testing: e2e
Promote: pending

- WHEN a story has static mocks defined
- AND the story is viewed at `/ui`
- THEN the MSW handlers are activated
- AND matching network requests return mock responses

### Scenario: Story with mock factory *[NEX-msw-mocking.property.factory]*
Testing: e2e
Promote: pending

- WHEN a story has a mock factory function
- AND control values change
- THEN the mocks are regenerated with new control values
- AND the updated handlers are applied

### Scenario: Story without mocks *[NEX-msw-mocking.property.none]*
Testing: e2e
Promote: pending

- WHEN a story has no `mocks` property
- THEN no MSW handlers are applied
- AND network requests pass through to real endpoints

---

## MSW Worker Lifecycle *[NEX-msw-mocking.lifecycle]*

The system manages the MSW service worker lifecycle.

### Scenario: Worker initialization *[NEX-msw-mocking.lifecycle.init]*
Testing: e2e
Promote: pending

- WHEN MSW is installed as a peer dependency
- AND the NextbookShell component mounts
- THEN the MSW worker is started with `onUnhandledRequest: 'bypass'`
- AND unhandled requests pass through to real endpoints

### Scenario: Handler isolation between stories *[NEX-msw-mocking.lifecycle.isolation]*
Testing: e2e
Promote: pending

- WHEN a user is viewing a story with mocks
- AND the user navigates to a different story
- THEN the previous story's handlers are cleared
- AND the new story's handlers (if any) are applied

### Scenario: MSW not installed *[NEX-msw-mocking.lifecycle.not-installed]*
Testing: e2e
Promote: pending

- WHEN MSW is not installed as a peer dependency
- AND a story with mocks is viewed
- THEN the mocks are ignored
- AND a console warning indicates MSW is required

---

## UI Mock Status Indicator *[NEX-msw-mocking.indicator]*

The system displays a visual indicator when mocks are active.

### Scenario: Mocks active indicator *[NEX-msw-mocking.indicator.active]*
Testing: e2e
Promote: pending

- WHEN a story with mocks is being viewed
- AND the mocks are successfully applied
- THEN a "Mocks Active" indicator is visible in the story viewer
- AND the indicator has a tooltip explaining mock behavior

### Scenario: No mocks indicator *[NEX-msw-mocking.indicator.none]*
Testing: e2e
Promote: pending

- WHEN a story without mocks is being viewed
- THEN the mock status indicator is not displayed
