# Add MSW Mocking Support

## Summary

Add optional MSW (Mock Service Worker) integration to nextbook, allowing developers to mock API endpoints when viewing component stories at `/ui`. This enables testing components that make internal API calls without requiring real backends, authentication, or network connectivity.

## Problem

When developers view component stories at `/ui`, components that make internal API calls still hit real endpoints. This creates friction:

1. **Authentication barriers** - Components requiring auth tokens/sessions can't be tested in isolation
2. **Environment dependencies** - APIs might not exist locally or in CI
3. **Unpredictable data** - Real data varies, making visual testing inconsistent
4. **Side effects** - Real calls might modify production data
5. **Can't test edge cases** - Hard to trigger error states, loading states, or specific data scenarios

## Solution

Add an optional `mocks` property to the `story()` function that accepts MSW request handlers. When a story with mocks is viewed, nextbook activates those handlers, intercepting matching network requests and returning mock responses.

**Key design decisions:**
- MSW is a **peer dependency** - users install and set up MSW themselves
- No re-exports - users import MSW utilities directly from `msw`
- Mock factories - mocks can be functions that receive control values
- UI indicator - shows when mocks are active

## Scope

### In Scope
- Add `mocks` property to `story()` accepting MSW handlers or factory function
- MSW worker lifecycle management in NextbookShell/StoryViewer
- UI indicator showing "Mocks Active" status
- Documentation in README and marketing website (including MSW setup instructions)

### Out of Scope (Future)
- `mock(zodSchema)` helper for auto-generating data (users can use @anatine/zod-mock)
- Network panel showing intercepted requests
- GraphQL-specific helpers (MSW supports GraphQL natively)

## API Design

### Basic Usage

```typescript
import { story } from 'nextbook'
import { http, HttpResponse } from 'msw'

export const Default = story({
  component: UserProfile,
  mocks: [
    http.get('/api/user', () => HttpResponse.json({ name: 'John Doe' })),
  ]
})
```

### Mock Factories (Mocks Depend on Controls)

```typescript
export const Controlled = story({
  schema: z.object({
    userName: z.string().default('Jane'),
    shouldError: z.boolean().default(false),
  }),
  mocks: ({ userName, shouldError }) => [
    http.get('/api/user', () => {
      if (shouldError) {
        return new HttpResponse(null, { status: 500 })
      }
      return HttpResponse.json({ name: userName })
    })
  ],
  render: (props) => <UserProfile />,
})
```

### Error and Loading States

```typescript
import { delay } from 'msw'

export const Loading = story({
  mocks: [
    http.get('/api/user', async () => {
      await delay('infinite')  // Never resolves
      return HttpResponse.json({})
    })
  ],
  render: () => <UserProfile />,
})

export const Error = story({
  mocks: [
    http.get('/api/user', () => new HttpResponse(null, { status: 500 }))
  ],
  render: () => <UserProfile />,
})
```

## Dependencies

- `msw` as peer dependency (optional)
- No new bundled dependencies

## Affected Areas

- `packages/nextbook/src/story.ts` - Add mocks to StoryConfig/Story types
- `packages/nextbook/src/types.ts` - Add mock-related types
- `packages/nextbook/src/components/story-viewer.tsx` - Apply mocks when rendering
- `packages/nextbook/src/components/nextbook-shell.tsx` - Initialize MSW worker
- `README.md` - Document mocking feature with MSW setup instructions
- `apps/web/` - Update marketing site with mocking feature
