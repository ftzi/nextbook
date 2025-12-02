# MSW Mocking Specification

## ADDED Requirements

### Requirement: Mocks Property on Story

The `story()` function SHALL accept an optional `mocks` property for defining MSW request handlers.

The `mocks` property SHALL:
- Accept an array of MSW `RequestHandler` objects
- Accept a factory function that receives control values and returns handlers
- Be optional (stories without mocks work as before)
- Only be active when MSW is installed as a peer dependency

#### Scenario: Story with static mocks

- **GIVEN** a story with static mocks defined
- **WHEN** the story is viewed at `/ui`
- **THEN** the MSW handlers are activated
- **AND** matching network requests return mock responses

```typescript
import { story } from 'nextbook'
import { http, HttpResponse } from 'msw'

export const Default = story({
  render: () => <UserProfile />,
  mocks: [
    http.get('/api/user', () => HttpResponse.json({ name: 'John' })),
  ]
})
```

#### Scenario: Story with mock factory

- **GIVEN** a story with a mock factory function
- **WHEN** control values change
- **THEN** the mocks are regenerated with new control values
- **AND** the updated handlers are applied

```typescript
export const Controlled = story({
  schema: z.object({
    userName: z.string().default('Jane'),
  }),
  mocks: ({ userName }) => [
    http.get('/api/user', () => HttpResponse.json({ name: userName })),
  ],
  render: () => <UserProfile />,
})
```

#### Scenario: Story without mocks

- **GIVEN** a story without the `mocks` property
- **WHEN** the story is viewed
- **THEN** no MSW handlers are applied
- **AND** network requests pass through to real endpoints

### Requirement: MSW Worker Lifecycle

The system SHALL manage the MSW service worker lifecycle within the nextbook UI.

#### Scenario: Worker initialization

- **GIVEN** MSW is installed as a peer dependency
- **WHEN** the NextbookShell component mounts
- **THEN** the MSW worker is started with `onUnhandledRequest: 'bypass'`
- **AND** unhandled requests pass through to real endpoints

#### Scenario: Handler isolation between stories

- **GIVEN** a user is viewing a story with mocks
- **WHEN** the user navigates to a different story
- **THEN** the previous story's handlers are cleared
- **AND** the new story's handlers (if any) are applied

#### Scenario: MSW not installed

- **GIVEN** MSW is not installed as a peer dependency
- **WHEN** a story with mocks is viewed
- **THEN** the mocks are ignored
- **AND** a console warning indicates MSW is required for mocking

### Requirement: UI Mock Status Indicator

The system SHALL display a visual indicator when mocks are active.

#### Scenario: Mocks active indicator

- **GIVEN** a story with mocks is being viewed
- **WHEN** the mocks are successfully applied
- **THEN** a "Mocks Active" indicator is visible in the story viewer header
- **AND** the indicator has a tooltip explaining that network requests are being intercepted

#### Scenario: No mocks indicator

- **GIVEN** a story without mocks is being viewed
- **THEN** the mock status indicator is not displayed

### Requirement: Prop-Based Mocking Documentation

The documentation SHALL include guidance on prop-based mocking as an alternative approach.

#### Scenario: README mocking section

- **GIVEN** the README.md documentation
- **THEN** it includes a "Mocking" section explaining:
  - Prop-based mocking (passing mock functions/data as props)
  - MSW-based mocking (using the `mocks` property)
  - MSW setup instructions (`npm install msw`, `npx msw init public`)
  - When to use each approach
  - Links to MSW documentation and @anatine/zod-mock

## Type Definitions

```typescript
import type { RequestHandler } from 'msw'

// Extended StoryConfig with mocks
type StoryConfig<TSchema extends z.ZodType | undefined = undefined> =
  TSchema extends z.ZodType
    ? {
        schema: TSchema
        render: (props: z.output<TSchema>) => ReactNode
        mocks?: RequestHandler[] | ((props: z.output<TSchema>) => RequestHandler[])
      }
    : {
        schema?: undefined
        render: () => ReactNode
        mocks?: RequestHandler[]
      }
```
