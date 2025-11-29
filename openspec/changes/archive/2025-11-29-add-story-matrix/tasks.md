# Implementation Tasks

## 1. Core API

- [x] 1.1 Create `src/story-matrix.ts` with `storyMatrix()` function
- [x] 1.2 Add `MatrixStory` and `MatrixStoryConfig` types to `src/types.ts`
- [x] 1.3 Add `isMatrixStory()` type guard to `src/story-matrix.ts`
- [x] 1.4 Export `storyMatrix` and `isMatrixStory` from `src/index.ts`

## 2. Combination Generation

- [x] 2.1 Add `getEnumerableValues()` function to `src/utils/schema.ts`
- [x] 2.2 Add `generateCombinations()` function to `src/utils/schema.ts`
- [x] 2.3 Handle boolean → `[true, false]`
- [x] 2.4 Handle enum → all values
- [x] 2.5 Handle string/number → default value only
- [x] 2.6 Implement Cartesian product algorithm
- [x] 2.7 Add combination limit (100) with overflow detection

## 3. Matrix View UI

- [x] 3.1 Create `src/components/matrix-viewer.tsx` component
- [x] 3.2 Create `src/components/matrix-viewer.module.css` styles
- [x] 3.3 Implement responsive grid layout
- [x] 3.4 Add prop value labels to each cell
- [x] 3.5 Style labels to be subtle but readable
- [x] 3.6 Add click-to-isolate functionality
- [x] 3.7 Add "back to matrix" navigation
- [x] 3.8 Add pagination for large matrices (>100)
- [x] 3.9 Add warning message for paginated results

## 4. Integration

- [x] 4.1 Update `story-viewer.tsx` to detect and route matrix stories
- [x] 4.2 Ensure matrix stories work with background switcher
- [x] 4.3 Test with sidebar navigation

## 5. Example & Documentation

- [x] 5.1 Add matrix story example to `apps/example/`
- [x] 5.2 Update root `README.md` with storyMatrix documentation
- [x] 5.3 Add "Why Nextbook > Storybook" section about matrix
- [ ] 5.4 Update CLI templates if applicable

## 6. Testing

- [ ] 6.1 Add unit tests for `storyMatrix()` function
- [ ] 6.2 Add unit tests for `generateCombinations()`
- [ ] 6.3 Add unit tests for `isMatrixStory()`
- [ ] 6.4 Add Playwright visual regression test for matrix view

## 7. Verification

- [x] 7.1 Run `bun ok` - all type checks and linting pass
- [x] 7.2 Run `bun test` - all unit tests pass
- [ ] 7.3 Run `bun test:e2e` - visual regression tests pass
- [ ] 7.4 Manual testing in example app
