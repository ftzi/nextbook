# Design: storyMatrix Implementation

## Context

Nextbook already has Zod schema introspection (`src/utils/schema.ts`) that extracts control configurations. We need to extend this to:
1. Extract ALL possible values for each prop (not just type info)
2. Compute the Cartesian product of all value combinations
3. Render them in a visual matrix UI

The challenge is handling infinite value spaces (strings, numbers) while providing maximum value for finite spaces (booleans, enums).

## Goals / Non-Goals

**Goals:**
- Zero-config matrix generation from Zod schemas
- Visual grid showing all combinations at once
- Handle combinatorial explosion gracefully (pagination, filtering)
- Support all Zod types that `story()` already supports
- AI-friendly API that's trivial to generate

**Non-Goals:**
- Pairwise/combinatorial reduction algorithms (future enhancement)
- Custom value sampling for infinite types (use defaults for v1)
- Nested object flattening (v1 only handles flat schemas)
- Animation/transition testing

## Decisions

### Decision 1: API Design

**Choice**: Separate `storyMatrix()` function (not a flag on `story()`)

```tsx
import { storyMatrix } from "nextbook";

export const AllVariants = storyMatrix({
  schema: z.object({
    variant: z.enum(["primary", "secondary", "ghost"]),
    size: z.enum(["sm", "md", "lg"]),
    disabled: z.boolean(),
  }),
  render: (props) => <Button {...props}>Click me</Button>,
});
```

**Rationale:**
- Fundamentally different rendering mode deserves distinct function
- Cleaner TypeScript types (no conditional union types)
- Explicit intent - developers know what they're creating
- Follows "do one thing well" principle

**Alternatives considered:**
- `story({ matrix: true })` - Rejected: muddies the API, complex types
- `story.matrix({...})` - Rejected: unusual pattern, harder to tree-shake

### Decision 2: Value Extraction Strategy

**Choice**: Use finite values for enumerable types, default values for infinite types

| Zod Type | Values Used |
|----------|-------------|
| `z.boolean()` | `[true, false]` |
| `z.enum([...])` | All enum values |
| `z.literal(x)` | `[x]` |
| `z.string()` | `[defaultValue]` or `[""]` |
| `z.number()` | `[defaultValue]` or `[0]` |

**Rationale:**
- Booleans and enums are the common case for visual testing
- Strings/numbers often represent content, not visual variants
- Keeps matrix size manageable
- Future: `sampleValues` option for explicit string/number sets

### Decision 3: Combination Limit

**Choice**: Default limit of 100 combinations with pagination

**Rationale:**
- 100 combinations renders quickly (<1s)
- Handles most real cases: 4 variants × 4 sizes × 2 states = 32
- Pagination for larger matrices (rare in practice)
- Future: filtering to reduce displayed combinations

### Decision 4: Matrix Layout

**Choice**: CSS Grid with auto-sizing cells, one component per cell

```
┌─────────────────────────────────────────────────────┐
│  variant=primary, size=sm   │  variant=primary, size=md   │  ...
│  ┌─────────────────────┐    │  ┌─────────────────────┐    │
│  │      [Button]       │    │  │      [Button]       │    │
│  └─────────────────────┘    │  └─────────────────────┘    │
├─────────────────────────────┼─────────────────────────────┼
│  variant=secondary, size=sm │  variant=secondary, size=md │  ...
│  ┌─────────────────────┐    │  ┌─────────────────────┐    │
│  │      [Button]       │    │  │      [Button]       │    │
│  └─────────────────────┘    │  └─────────────────────┘    │
└─────────────────────────────┴─────────────────────────────┴
```

**Rationale:**
- Grid provides natural structure
- Each cell shows prop values as subtle labels
- Responsive: cells wrap on smaller screens
- Click to isolate: clicking a cell expands it to full view with controls

### Decision 5: Detection Mechanism

**Choice**: Add `__nextbook_matrix: true` marker to matrix stories

```tsx
type MatrixStory = {
  __nextbook: true
  __nextbook_matrix: true
  schema: z.ZodObject<z.ZodRawShape>
  render: (props: z.output<Schema>) => ReactNode
}
```

**Rationale:**
- Compatible with existing `isStory()` check
- Easy to add `isMatrixStory()` type guard
- No breaking changes to story detection

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Combinatorial explosion (1000+ combinations) | Default limit of 100, pagination, clear warning |
| Performance with many DOM nodes | Virtual scrolling for large matrices (future) |
| Non-enumerable types (strings/numbers) | Use defaults only, document limitation |
| Complex nested schemas | V1 only supports flat `z.object()`, error for nested |

## Migration Plan

No migration needed - this is a new additive feature. Existing `story()` usage unchanged.

## Open Questions

1. **Should clicking a cell open it with the controls panel?** - Proposed: Yes, for detailed inspection
2. **Should we support row/column headers for 2D matrix view?** - Proposed: Future enhancement
3. **Should we add a `sampleValues` option for strings/numbers?** - Proposed: Future enhancement

```tsx
// Future API possibility
storyMatrix({
  schema: z.object({
    label: z.string(),
    count: z.number(),
  }),
  sampleValues: {
    label: ["Short", "A much longer label for testing"],
    count: [0, 1, 100, 9999],
  },
  render: (props) => <Badge {...props} />,
});
```
