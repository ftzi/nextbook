# Matrix Viewer *[NEX-matrix-viewer]*

The matrix viewer displays all prop combinations for a `storyMatrix()` story in a virtualized grid. This allows developers to see every variant of a component at once, useful for visual regression testing and design review.

## Design Decisions

For components with many combinations (e.g., 3 variants × 4 sizes × 2 states = 24 cells), rendering all cells at once causes performance issues. We use a custom virtualization hook to render only visible rows.

Instead of using a library like `react-virtual`, we implemented a custom `useVirtualizer` hook to maintain our zero-dependencies principle.

For Playwright screenshots and visual regression testing, we provide a `?fullRender=true` URL parameter that disables virtualization and renders all cells.

---

## Grid Layout *[NEX-matrix-viewer.grid]*

The matrix displays combinations in a grid layout.

### Scenario: Cells arranged by combination *[NEX-matrix-viewer.grid.arrangement]*
Testing: e2e

- WHEN a matrix story is viewed
- THEN each prop combination is rendered in its own cell
- AND cells are arranged in a responsive grid

### Scenario: Cell labels *[NEX-matrix-viewer.grid.labels]*
Testing: e2e

- WHEN viewing a matrix cell
- THEN the cell displays its prop values as a label
- AND the label helps identify which combination it represents

---

## Virtualized Rendering *[NEX-matrix-viewer.virtualization]*

The matrix uses virtualization for performance.

### Scenario: Only visible rows rendered *[NEX-matrix-viewer.virtualization.visible-only]*
Testing: e2e

- WHEN the matrix has many rows
- THEN only visible rows are rendered to the DOM
- AND scrolling renders new rows as needed

### Scenario: Smooth scrolling *[NEX-matrix-viewer.virtualization.smooth]*
Testing: e2e

- WHEN user scrolls the matrix
- THEN rows appear seamlessly
- AND no visual jank or flicker occurs

### Scenario: Dynamic cell measurement *[NEX-matrix-viewer.virtualization.measurement]*
Testing: unit

- WHEN the matrix first renders
- THEN default cell dimensions are used (220x140)
- AND actual cell size is measured after first render
- AND subsequent renders use measured dimensions

---

## Full Render Mode *[NEX-matrix-viewer.full-render]*

The matrix supports disabling virtualization for testing.

### Scenario: Full render via URL *[NEX-matrix-viewer.full-render.url]*
Testing: e2e

- WHEN URL has `?fullRender=true` parameter
- THEN all cells are rendered to the DOM
- AND virtualization is disabled

### Scenario: Playwright screenshot compatibility *[NEX-matrix-viewer.full-render.playwright]*
Testing: e2e

- WHEN taking a Playwright screenshot with fullRender
- THEN all combinations are visible in the screenshot
- AND the screenshot captures the complete matrix

---

## Accessible Cells *[NEX-matrix-viewer.accessibility]*

Matrix cells are accessible and interactive.

### Scenario: Keyboard navigation *[NEX-matrix-viewer.accessibility.keyboard]*
Testing: e2e

- WHEN a cell is focused
- THEN pressing Enter/Space triggers click
- AND Tab moves to next cell

### Scenario: No nested button errors *[NEX-matrix-viewer.accessibility.no-nested-buttons]*
Testing: e2e

- WHEN story content contains a button
- AND the cell is also interactive
- THEN no nested button HTML errors occur
- AND cell uses `div[role="button"]` instead of `<button>`
