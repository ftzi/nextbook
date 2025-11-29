# Change: Add storyMatrix for Automatic Combinatorial Component Testing

## Why

Storybook's approach is fundamentally broken for real-world component libraries. It encourages developers to manually write individual story exports for each variant:

```tsx
export const Primary = () => <Button variant="primary" />
export const Secondary = () => <Button variant="secondary" />
export const PrimaryDisabled = () => <Button variant="primary" disabled />
export const SecondaryDisabled = () => <Button variant="secondary" disabled />
export const PrimarySmall = () => <Button variant="primary" size="sm" />
// ... 20+ more exports for every combination
```

This approach:
1. **Scales poorly** - A component with 2 variants × 3 sizes × 2 disabled states = 12 combinations to write manually
2. **Drifts out of sync** - When you add a new variant, you forget to add all its combinations
3. **Creates busywork** - Developers waste time writing boilerplate instead of building
4. **Misses edge cases** - Manual enumeration inevitably misses combinations

**The insight**: When you have a Zod schema, you already have the complete specification of all valid prop combinations. The schema IS the source of truth.

`storyMatrix` leverages this insight to **automatically generate and display ALL valid combinations** from a Zod schema in a visual matrix. Zero boilerplate. Zero drift. Zero missed combinations.

This is not an incremental improvement—it's a paradigm shift that makes Nextbook categorically superior to Storybook for component development.

## What Changes

- **NEW `storyMatrix()` function** - Creates a matrix story that auto-generates all prop combinations from a Zod schema
- **NEW Matrix View UI** - Displays all combinations in a grid layout with labels for each prop value
- **NEW combination filtering** - Allow users to filter/focus on specific prop values
- **Public export** - `storyMatrix` exported from `nextbook` alongside `story`

## Impact

- Affected specs: `story-api` (new capability)
- Affected code:
  - `packages/nextbook/src/story-matrix.ts` (new)
  - `packages/nextbook/src/components/matrix-viewer.tsx` (new)
  - `packages/nextbook/src/components/story-viewer.tsx` (matrix detection)
  - `packages/nextbook/src/utils/schema.ts` (combination generation)
  - `packages/nextbook/src/index.ts` (export)
  - `README.md` (documentation)
