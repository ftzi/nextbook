# Plan: Add storyMatrix for Automatic Combinatorial Component Testing

## Summary

Add `storyMatrix()` function that automatically generates and displays all valid prop combinations from a Zod schema in a visual matrix. This is a paradigm shift from Storybook's manual variant enumeration approach.

## Why

Storybook's approach is fundamentally broken for real-world component libraries. It encourages developers to manually write individual story exports for each variant:

```tsx
export const Primary = () => <Button variant="primary" />
export const Secondary = () => <Button variant="secondary" />
export const PrimaryDisabled = () => <Button variant="primary" disabled />
// ... 20+ more exports for every combination
```

This approach:
1. **Scales poorly** - 2 variants × 3 sizes × 2 disabled states = 12 combinations manually
2. **Drifts out of sync** - When you add a variant, you forget combinations
3. **Creates busywork** - Writing boilerplate instead of building
4. **Misses edge cases** - Manual enumeration inevitably misses combinations

**The insight**: When you have a Zod schema, you already have the complete specification of all valid prop combinations. The schema IS the source of truth.

## What Changes

- **NEW `storyMatrix()` function** - Creates matrix story auto-generating all prop combinations
- **NEW Matrix View UI** - Displays combinations in grid layout with labels
- **NEW combination filtering** - Filter/focus on specific prop values
- **Public export** - `storyMatrix` exported from `nextbook` alongside `story`

## Tasks

### Phase 1: Core API
- [x] 1.1 Create `src/story-matrix.ts` with `storyMatrix()` function
- [x] 1.2 Add `MatrixStory` and `MatrixStoryConfig` types
- [x] 1.3 Add `isMatrixStory()` type guard
- [x] 1.4 Export from `src/index.ts`

### Phase 2: Combination Generation
- [x] 2.1 Add `getEnumerableValues()` to `src/utils/schema.ts`
- [x] 2.2 Add `generateCombinations()` function
- [x] 2.3 Handle boolean → `[true, false]`
- [x] 2.4 Handle enum → all values
- [x] 2.5 Handle string/number → default value only
- [x] 2.6 Implement Cartesian product algorithm
- [x] 2.7 Add combination limit (100) with overflow detection

### Phase 3: Matrix View UI
- [x] 3.1 Create `matrix-viewer.tsx` component
- [x] 3.2 Create `matrix-viewer.module.css` styles
- [x] 3.3 Implement responsive grid layout
- [x] 3.4 Add prop value labels to each cell
- [x] 3.5 Add click-to-isolate functionality
- [x] 3.6 Add "back to matrix" navigation
- [x] 3.7 Add pagination for large matrices

### Phase 4: Integration
- [x] 4.1 Update `story-viewer.tsx` to detect matrix stories
- [x] 4.2 Ensure matrix stories work with background switcher
- [x] 4.3 Test with sidebar navigation

### Phase 5: Documentation
- [x] 5.1 Add matrix story example
- [x] 5.2 Update root README.md with storyMatrix documentation

## Affected Specs

- `[NEX.story-api.matrix]` — ADDED (storyMatrix function and matrix view)
- `[NEX.matrix-viewer]` — ADDED (matrix viewer component)
