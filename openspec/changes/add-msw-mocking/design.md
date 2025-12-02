# MSW Mocking - Design Document

## Overview

This document captures architectural decisions for adding MSW mocking support to nextbook.

## Architecture

### Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                        NextbookShell                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  useEffect: Initialize MSW worker (once on mount)        │  │
│  │  - setupWorker() from msw/browser                        │  │
│  │  - worker.start({ onUnhandledRequest: 'bypass' })        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     StoryViewer                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  useEffect: Apply story mocks when story changes   │  │  │
│  │  │  1. worker.resetHandlers()                         │  │  │
│  │  │  2. Compute mocks (static or from factory)         │  │  │
│  │  │  3. worker.use(...mocks)                           │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Header: Show "Mocks Active" indicator if mocks    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### MSW Worker Management

**Option 1: Global worker in NextbookShell (Recommended)**
- Single worker instance shared across all story views
- Handlers swapped when navigating between stories
- Minimal overhead, no repeated start/stop

**Option 2: Per-story worker lifecycle**
- Start worker when story with mocks is viewed
- Stop when navigating away
- More overhead, cleaner isolation

We chose **Option 1** because:
- MSW recommends a single worker instance
- Avoids service worker registration/unregistration delays
- `resetHandlers()` provides sufficient isolation

### Mock Factory Execution

When a story has a mock factory (function), we need to re-compute mocks when control values change:

```typescript
// In StoryViewer
useEffect(() => {
  if (!story.mocks || !workerRef.current) return

  const handlers = typeof story.mocks === 'function'
    ? story.mocks(values)  // Factory receives current control values
    : story.mocks

  workerRef.current.resetHandlers()
  workerRef.current.use(...handlers)
}, [story.mocks, values])  // Re-run when mocks or values change
```

### MSW Detection Strategy

**At Runtime (NextbookShell):**
```typescript
// Dynamic import to avoid bundling MSW when not installed
async function initializeMsw() {
  try {
    const { setupWorker } = await import('msw/browser')
    const worker = setupWorker()
    await worker.start({ onUnhandledRequest: 'bypass' })
    return worker
  } catch {
    // MSW not installed - mocking disabled
    return null
  }
}
```

### Service Worker Setup

Users set up MSW themselves using the standard MSW commands:
```bash
npm install msw --save-dev
npx msw init public
```

This keeps nextbook simple and lets MSW manage its own service worker file.

## Trade-offs

### Peer Dependency vs Bundled

| Approach | Pros | Cons |
|----------|------|------|
| Peer dependency | Users control version, no bloat when unused | Extra install step |
| Bundled | Zero-config | Bloat for users who don't need mocking |

**Decision: Peer dependency**
- Aligns with MSW's recommended setup
- No bundle impact for non-mocking users
- Users can update MSW independently

### Re-export MSW vs Direct Import

| Approach | Pros | Cons |
|----------|------|------|
| Re-export | Single import source | Version coupling, maintenance burden |
| Direct import | Standard MSW usage, transferable knowledge | Two imports needed |

**Decision: Direct import from MSW**
- MSW has excellent docs users can reference
- No API surface maintenance for us
- Follows Storybook addon-msw pattern

### Mock Factory vs Static Only

| Approach | Pros | Cons |
|----------|------|------|
| Static only | Simpler implementation | Can't derive mocks from controls |
| Factory function | Mocks can use control values | More complex, re-computation needed |

**Decision: Support both**
- Static mocks for simple cases
- Factory functions for advanced scenarios (error toggles, dynamic data)

## Error Handling

### MSW Not Installed

When a story has `mocks` but MSW isn't installed:
```typescript
console.warn(
  '[nextbook] Story has mocks but MSW is not installed. ' +
  'Install msw to enable mocking: npm install msw --save-dev'
)
```

### Service Worker Missing

When MSW is installed but `mockServiceWorker.js` doesn't exist:
```typescript
console.warn(
  '[nextbook] MSW service worker not found. ' +
  'Run `npx nextbook init` to generate it, or run `npx msw init public`.'
)
```

### Handler Errors

MSW handles errors internally. We don't need special error handling for handler execution.

## Future Considerations

### Network Panel (Phase 2)

A network panel showing intercepted requests would be valuable:
- List of intercepted requests with method, URL, status
- Ability to inspect request/response bodies
- Toggle to temporarily disable mocking

### Zod Mock Generation (Phase 2)

Integration with `@anatine/zod-mock` or similar:
```typescript
import { mock } from 'nextbook/mock'  // Optional export

story({
  schema: userSchema,
  mocks: [
    http.get('/api/user', () => HttpResponse.json(mock(userSchema)))
  ]
})
```

This would be a separate optional export to avoid bundling faker.js.
