# Controls Panel [STO.controls-panel]

The controls panel provides interactive UI for manipulating story props. It introspects Zod schemas to automatically generate appropriate input controls for each prop type.

## Design Decisions

By leveraging Zod's schema structure, we determine prop types at runtime, extract default values, and get enum options automatically. This eliminates the need for manual control definitions like Storybook's `argTypes`.

The panel supports both Zod 3 and Zod 4 through careful schema introspection. It's collapsible to maximize story viewing area when controls aren't needed.

---

## Schema-Driven Controls [STO.controls-panel.schema]

The controls panel generates inputs based on Zod schema types.

### Scenario: String control [STO.controls-panel.schema.string]
Testing: e2e

- WHEN schema has a `z.string()` property
- THEN a text input is rendered
- AND changing the input updates the story prop

### Scenario: Number control [STO.controls-panel.schema.number]
Testing: e2e

- WHEN schema has a `z.number()` property
- THEN a number input is rendered
- AND changing the input updates the story prop

### Scenario: Boolean control [STO.controls-panel.schema.boolean]
Testing: e2e

- WHEN schema has a `z.boolean()` property
- THEN a checkbox/toggle is rendered
- AND toggling it updates the story prop

### Scenario: Enum control [STO.controls-panel.schema.enum]
Testing: e2e

- WHEN schema has a `z.enum()` property
- THEN a select dropdown is rendered
- AND options match the enum values
- AND selecting an option updates the story prop

### Scenario: Optional control [STO.controls-panel.schema.optional]
Testing: e2e

- WHEN schema has a `.optional()` property
- THEN the control allows clearing/undefined state
- AND the UI indicates the value is optional

---

## Default Value Handling [STO.controls-panel.defaults]

Controls respect and display schema default values.

### Scenario: Initial values from defaults [STO.controls-panel.defaults.initial]
Testing: e2e

- WHEN a controlled story renders
- THEN controls show schema default values
- AND the story renders with those defaults

### Scenario: Reset to defaults [STO.controls-panel.defaults.reset]
Testing: e2e

- WHEN user has modified control values
- AND clicks a reset button
- THEN all controls return to schema defaults
- AND the story re-renders with defaults

---

## Panel Visibility [STO.controls-panel.visibility]

The controls panel is toggleable.

### Scenario: Panel shown for controlled stories [STO.controls-panel.visibility.shown]
Testing: e2e

- WHEN viewing a story with a schema
- THEN the controls panel is visible by default

### Scenario: Panel hidden for simple stories [STO.controls-panel.visibility.hidden]
Testing: e2e

- WHEN viewing a story without a schema
- THEN no controls panel is shown

### Scenario: Panel collapse toggle [STO.controls-panel.visibility.collapse]
Testing: e2e

- WHEN user clicks the collapse button
- THEN the panel collapses to minimize space
- AND clicking again expands it

---

## Real-Time Updates [STO.controls-panel.realtime]

Control changes immediately update the story.

### Scenario: Instant re-render [STO.controls-panel.realtime.instant]
Testing: e2e

- WHEN a control value changes
- THEN the story re-renders immediately
- AND no submit/apply button is needed

### Scenario: URL state sync [STO.controls-panel.realtime.url-sync]
Testing: e2e

- WHEN control values change
- THEN URL query parameters update to reflect state
- AND refreshing the page restores the control values
