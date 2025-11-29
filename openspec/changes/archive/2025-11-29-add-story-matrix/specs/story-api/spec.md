# Story API Specification

## ADDED Requirements

### Requirement: storyMatrix Function

The system SHALL provide a `storyMatrix()` function that creates matrix stories displaying all valid prop combinations from a Zod schema.

The function SHALL:
- Accept a configuration object with `schema` (required ZodObject) and `render` (required function)
- Return a story object identifiable as a matrix story
- Be exported from the main `nextbook` package
- Support all Zod types that `story()` supports (string, number, boolean, enum, literal)

#### Scenario: Creating a matrix story with enums and booleans
- **WHEN** a developer creates a matrix story with a schema containing enums and booleans
- **THEN** the story object is created with matrix marker
- **AND** the schema and render function are preserved

```tsx
import { storyMatrix } from "nextbook";
import { z } from "zod";

export const AllVariants = storyMatrix({
  schema: z.object({
    variant: z.enum(["primary", "secondary"]),
    disabled: z.boolean(),
  }),
  render: (props) => <Button {...props} />,
});
```

#### Scenario: Matrix story detection
- **WHEN** Nextbook encounters a matrix story export
- **THEN** it is detected by the existing `isStory()` check
- **AND** it is additionally identifiable as a matrix story via `isMatrixStory()`

### Requirement: Combination Generation

The system SHALL generate all valid prop combinations from a Zod schema for matrix rendering.

#### Scenario: Boolean prop generates two values
- **WHEN** a schema contains `z.boolean()`
- **THEN** combinations include both `true` and `false` values

#### Scenario: Enum prop generates all enum values
- **WHEN** a schema contains `z.enum(["a", "b", "c"])`
- **THEN** combinations include all three values: "a", "b", "c"

#### Scenario: String prop uses default value only
- **WHEN** a schema contains `z.string().default("hello")`
- **THEN** combinations include only the default value "hello"

#### Scenario: Number prop uses default value only
- **WHEN** a schema contains `z.number().default(42)`
- **THEN** combinations include only the default value 42

#### Scenario: Cartesian product of multiple props
- **WHEN** a schema contains 2 booleans and a 3-value enum
- **THEN** 2 × 2 × 3 = 12 combinations are generated

### Requirement: Matrix View Rendering

The system SHALL render matrix stories in a grid layout showing all combinations simultaneously.

#### Scenario: Grid display of combinations
- **WHEN** a matrix story is viewed
- **THEN** all prop combinations are displayed in a responsive grid
- **AND** each cell shows the rendered component with its specific props

#### Scenario: Prop labels on each cell
- **WHEN** a matrix story is viewed
- **THEN** each cell displays labels indicating the prop values used
- **AND** labels are subtle and do not obscure the component

#### Scenario: Click to isolate combination
- **WHEN** a user clicks on a matrix cell
- **THEN** that combination expands to full view
- **AND** the controls panel shows current prop values
- **AND** the user can return to the matrix view

### Requirement: Combination Limit

The system SHALL limit the number of displayed combinations to prevent performance issues.

#### Scenario: Default combination limit
- **WHEN** a matrix story generates more than 100 combinations
- **THEN** only the first 100 are displayed initially
- **AND** pagination or "load more" is available for remaining combinations

#### Scenario: Warning for large matrices
- **WHEN** a matrix story would generate more than 100 combinations
- **THEN** a warning is displayed indicating the total count
- **AND** the user is informed that results are paginated

### Requirement: Error Handling

The system SHALL provide clear error messages for unsupported schema configurations.

#### Scenario: Nested object schema
- **WHEN** a matrix story schema contains nested `z.object()`
- **THEN** an error message indicates nested objects are not supported in matrix mode

#### Scenario: Schema without enumerable props
- **WHEN** a matrix story schema contains only strings/numbers without meaningful variation
- **THEN** the matrix renders with single combination using defaults
- **AND** a hint suggests adding enums or booleans for more coverage
