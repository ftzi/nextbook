# Story API [STO.story-api]

The `story()` function is the core API for defining component stories in storify. It provides a simple, type-safe way to create stories with optional Zod schemas for interactive controls.

## Design Decisions

Unlike Storybook's CSF (Component Story Format) with its metadata exports and decorators, storify uses a single `story()` function call — no default export required, no meta configuration, just export the result.

Zod schemas serve double duty: runtime validation of prop values and auto-generation of interactive controls UI. This avoids a separate "args" definition and keeps everything type-safe.

---

## Basic Story Definition [STO.story-api.basic]

The `story()` function accepts a configuration object and returns a Story.

### Scenario: Simple story without schema [STO.story-api.basic.simple]
Testing: unit

- WHEN `story()` is called with only a `render` function
- THEN it returns a Story object
- AND the render function receives no props

### Scenario: Controlled story with schema [STO.story-api.basic.controlled]
Testing: unit

- WHEN `story()` is called with a `schema` and `render` function
- THEN it returns a Story object
- AND the render function receives typed props from the schema
- AND defaults from the schema are used as initial values

---

## Story Type Detection [STO.story-api.type-detection]

The system detects and exposes the type of each story.

### Scenario: isStory type guard [STO.story-api.type-detection.is-story]
Testing: unit

- WHEN `isStory()` is called with a Story object
- THEN it returns `true`
- AND TypeScript narrows the type

### Scenario: Schema presence detection [STO.story-api.type-detection.has-schema]
Testing: unit

- WHEN a Story has a schema property
- THEN it is identified as a controlled story
- AND the controls panel is shown when viewing

### Scenario: Matrix story detection [STO.story-api.type-detection.is-matrix]
Testing: unit

- WHEN a Story was created with `storyMatrix()`
- THEN it has `isMatrix: true`
- AND the matrix viewer is used instead of single story viewer

---

## Matrix Stories [STO.story-api.matrix]

The `storyMatrix()` function creates stories that render all prop combinations.

### Scenario: Matrix generation [STO.story-api.matrix.generation]
Testing: unit

- WHEN `storyMatrix()` is called with a schema
- THEN all combinations of enum/boolean values are computed
- AND each combination is rendered in a grid cell

### Scenario: Matrix with non-combinatorial props [STO.story-api.matrix.non-combinatorial]
Testing: unit

- WHEN schema has string/number props without specific values
- THEN default values are used for those props
- AND only enum/boolean props are combined

---

## Story Exports Discovery [STO.story-api.discovery]

The system discovers all story exports from a module.

### Scenario: Named exports as stories [STO.story-api.discovery.named-exports]
Testing: unit

- WHEN a module has named exports that are Stories
- THEN each is discovered and displayed as a tab
- AND the export name becomes the story name

### Scenario: Non-story exports ignored [STO.story-api.discovery.non-story-ignored]
Testing: unit

- WHEN a module has exports that are not Stories
- THEN they are ignored
- AND no error is thrown

### Scenario: Default export ignored [STO.story-api.discovery.default-ignored]
Testing: unit

- WHEN a module has a default export
- THEN it is ignored for story discovery
- AND only named exports are considered

---

## Render Function Contract [STO.story-api.render]

The render function receives correctly typed props.

### Scenario: Props from schema [STO.story-api.render.props-from-schema]
Testing: unit

- WHEN a story has a schema
- THEN render receives `z.output<typeof schema>` as props
- AND TypeScript provides full autocomplete

### Scenario: No props without schema [STO.story-api.render.no-props]
Testing: unit

- WHEN a story has no schema
- THEN render is a zero-argument function
- AND TypeScript errors if props are expected

### Scenario: Schema defaults applied [STO.story-api.render.defaults]
Testing: unit

- WHEN schema has `.default()` values
- THEN those are used as initial render props
- AND controls panel shows default values
