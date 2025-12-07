# Plan: v1.0 Launch

## Summary

Prepare storify for v1.0.0 npm publication with CI/CD automation, contributor guidelines, and UI polish (light/dark mode toggle).

## Why

Storify is feature-complete and tested. These final items transform it from "working code" to "publishable product":
- **CI/CD**: Automates publishing, prevents manual errors
- **CONTRIBUTING.md**: Welcomes PRs while setting expectations
- **Light/dark mode toggle**: Users need control over preview background (not just system preference)
- **Housekeeping**: README cleanup, version bump, changelog

## What Changes

### storify package
- **NEW** Light/dark mode toggle in UI (StoryViewer toolbar)
- **MODIFIED** Version 0.1.0 → 1.0.0
- **MODIFIED** README.md - remove "STILL WIP!" header

### Repository root
- **NEW** `.github/workflows/publish.yml` - CI/CD for npm publishing
- **NEW** `.github/workflows/ci.yml` - PR checks (lint, test, build)
- **NEW** `CONTRIBUTING.md` - Contribution guidelines
- **NEW** `CHANGELOG.md` - Release notes

---

## Design Decisions

### Decision: Light/Dark Mode Implementation

**Choice:** Add toolbar toggle that persists to localStorage, defaults to system preference

**Alternatives considered:**
- System-only: Current behavior, no user control
- Separate setting page: Over-engineered for one toggle
- URL parameter: Doesn't persist across sessions

**Rationale:**
- Toolbar toggle is immediately discoverable
- localStorage persistence means preference survives refresh
- System preference as default is sensible fallback
- Minimal code addition (~20 lines)

### Decision: CI/CD Strategy

**Choice:** GitHub Actions with manual trigger for publishing, automatic for PR checks

**Alternatives considered:**
- Auto-publish on tag: Risk of accidental publishes
- Only manual publish: CLI command is simpler
- CircleCI/Jenkins: GitHub Actions is sufficient, free for public repos

**Rationale:**
- PR workflow: Automatic lint/test/build on every PR
- Publish workflow: Manual trigger with version input, requires maintainer approval
- Keeps control while reducing manual steps

---

## Tasks

### Phase 1: CI/CD Workflows
- [ ] Create `.github/workflows/ci.yml` for PR checks
  - Trigger: PR to main
  - Jobs: lint, test, build
  - Uses: bun setup action
- [ ] Create `.github/workflows/publish.yml` for npm publishing
  - Trigger: manual (workflow_dispatch) with version input
  - Jobs: build, publish to npm
  - Requires: NPM_TOKEN secret

### Phase 2: Contributor Guidelines
- [ ] Create `CONTRIBUTING.md` with:
  - How to set up dev environment
  - PR process and expectations
  - Code style (Biome, TypeScript strict)
  - Test requirements

### Phase 3: Light/Dark Mode Toggle
- [ ] Add theme toggle button to StoryViewer toolbar
- [ ] Implement localStorage persistence for theme preference
- [ ] Default to system preference (prefers-color-scheme)
- [ ] Update CSS to support manual override
- [ ] Add spec for theme switching behavior

### Phase 4: Final Shipping
- [ ] Remove "STILL WIP!" from README.md line 1
- [ ] Bump version to 1.0.0 in `packages/storify/package.json`
- [ ] Create `CHANGELOG.md` with v1.0.0 release notes
- [ ] Run `bun ok` to verify all checks pass
- [ ] Create git tag v1.0.0

---

## Affected Specs

- `[STO.story-viewer.theme]` — ADDED (new theme toggle feature)
- `[STO.story-viewer.toolbar]` — MODIFIED (add theme button)

---

## Notes

### NPM_TOKEN Setup

After merging, repository owner needs to:
1. Generate npm token: `npm token create`
2. Add to GitHub: Settings → Secrets → Actions → New secret `NPM_TOKEN`
