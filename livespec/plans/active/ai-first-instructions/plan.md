# Plan: AI-First Instructions

## Summary

Make storify the first component documentation tool with built-in AI assistant support. The CLI generates `CLAUDE.md` and `AGENTS.md` files that teach AI assistants how to write stories, enabling instant story generation with best practices.

## Why

**This is a powermove.** Storybook doesn't have this. Nobody does.

The AI-assisted development landscape:
- **Claude Code** reads `CLAUDE.md` files
- **Cursor** reads `.cursorrules` and `AGENTS.md`
- **Windsurf** reads `.windsurfrules`
- **GitHub Copilot** reads `.github/copilot-instructions.md`

By generating AI instruction files, storify becomes:
1. **Instantly productive** — AI knows how to write stories without user explanation
2. **Best practices by default** — AI follows patterns we define
3. **Zero learning curve** — Users say "write a story for Button" and it just works
4. **Marketing differentiator** — "AI-First Component Documentation"

The marker pattern (`<!-- STORIFY:START -->...<!-- STORIFY:END -->`) allows:
- Fresh installs get complete instructions
- Re-running `npx storify` upgrades the storify section
- Users can add custom instructions outside markers (project-specific patterns)

## What Changes

### packages/storify (CLI)
- **MODIFIED** `src/cli/init.ts` — Generate AI instruction files
- **MODIFIED** `src/cli/templates.ts` — Add `CLAUDE.md` and `AGENTS.md` templates
- **NEW** Marker-aware file writing (preserve user content outside markers)

### apps/nextjs (Marketing)
- **MODIFIED** Landing page — Add "AI-First" as key differentiator
- **MODIFIED** Features section — Highlight AI story generation
- **MODIFIED** Hero badges or features — "AI-Ready" messaging

### Root README.md
- **MODIFIED** Add AI-first section explaining the feature
- **MODIFIED** Update features list

---

## Design Decisions

### Decision: Which AI instruction files to generate

**Choice:** Generate both `CLAUDE.md` and `AGENTS.md` in the stories directory

**Alternatives considered:**
- Only `CLAUDE.md`: Excludes Cursor users
- Only `AGENTS.md`: Cursor convention, but Claude Code uses `CLAUDE.md`
- Single `AI.md` file: Not auto-detected by any tool
- Generate all formats (`.cursorrules`, `.windsurfrules`, etc.): Too many files, maintenance burden

**Rationale:**
- `CLAUDE.md` — Claude Code's native format
- `AGENTS.md` — Cursor and some other tools read this
- Same content, two files = maximum coverage with minimal duplication
- Users of other tools can reference these in their tool's config

### Decision: File location

**Choice:** Place files in `app/ui/` (the stories directory)

**Alternatives considered:**
- Project root: Clutters root, mixes with user's own CLAUDE.md
- `.storify/` hidden directory: Less discoverable
- `app/ui/.ai/`: Hidden, harder to find

**Rationale:**
- AI tools read CLAUDE.md from current directory and subdirectories
- When user is working in `app/ui/stories/`, the instructions are in scope
- Visible and editable by users
- Doesn't conflict with project-level CLAUDE.md

### Decision: Marker pattern for upgrades

**Choice:** Use HTML comments `<!-- STORIFY:START -->` and `<!-- STORIFY:END -->`

**Alternatives considered:**
- No markers (overwrite entire file): Destroys user customizations
- Different marker format: HTML comments work in markdown, familiar from other tools

**Rationale:**
- Matches pattern used by other tools (ruler, livespec)
- Allows users to add project-specific instructions outside markers
- Re-running CLI updates only the storify section
- Clear visual separation of managed vs user content

### Decision: Instruction content scope

**Choice:** Comprehensive but focused — cover story patterns, NOT general project info

**Rationale:**
Instructions should include:
- What storify is (brief)
- How to write `story()` — basic pattern
- Zod schema patterns for controls
- `storyMatrix()` for combinations
- File naming conventions (`*.story.tsx`)
- Best practices (defaults, organization)
- Examples for common components

Instructions should NOT include:
- Project-specific component locations (user adds this)
- Design system details (user adds this)
- Testing instructions (separate concern)

---

## Tasks

### Phase 1: CLI Implementation

- [x] Create marker-aware file writer utility
  - Read existing file if present
  - Find `<!-- STORIFY:START -->` and `<!-- STORIFY:END -->` markers
  - Replace content between markers (or append if no markers)
  - Preserve content outside markers

- [x] Write `CLAUDE.md` template content
  - Brief intro to storify
  - `story()` function pattern with examples
  - Zod schema patterns (string, number, boolean, enum, object)
  - `storyMatrix()` for generating combinations
  - File naming: `*.story.tsx`
  - Folder organization best practices
  - Common component examples (Button, Input, Card)
  - Instruction for user to add project-specific details below

- [x] Write `AGENTS.md` template (same content as CLAUDE.md)

- [x] Update `init.ts` to generate both files
  - Create in stories directory (e.g., `app/ui/`)
  - Use marker-aware writer
  - Log creation/update message

- [x] Add tests for marker-aware file operations

### Phase 2: Marketing & Documentation

- [x] Update landing page hero/features
  - Add "AI-Ready" or "AI-First" badge
  - Feature card: "AI-Powered Story Generation"
  - Description: "Built-in instructions for Claude, Cursor, and more"

- [x] Update comparison table
  - Add row: "AI Assistant Support" — Storybook: No, Storify: Yes (with checkmark)

- [x] Update root README.md
  - Add "AI-First Design" section
  - Explain what files are generated
  - Show example interaction ("write a story for my Button component")

### Phase 3: Polish

- [x] Ensure `bun ok` passes
- [ ] Test full flow: fresh install, re-run upgrade, user customization preserved
- [ ] Update any screenshots/examples if needed

---

## Affected Specs

- `[STO.cli.init]` — MODIFIED (generates AI instruction files)
- `[STO.cli.ai-instructions]` — ADDED (new feature)

---

## AI Instruction File Content (Draft)

```markdown
<!-- STORIFY:START -->
# Storify Story Instructions

This project uses [Storify](https://storify.dev) for component stories.

## Writing Stories

### Basic Story

```tsx
import { story } from "storify"
import { Button } from "@/components/ui/button"

export const Default = story({
  render: () => <Button>Click me</Button>,
})
```

### Story with Controls (Zod Schema)

```tsx
import { story } from "storify"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const Playground = story({
  schema: z.object({
    children: z.string().default("Click me"),
    variant: z.enum(["default", "secondary", "outline", "ghost"]).default("default"),
    size: z.enum(["sm", "default", "lg"]).default("default"),
    disabled: z.boolean().default(false),
  }),
  render: (props) => <Button {...props} />,
})
```

### Story Matrix (All Combinations)

```tsx
import { storyMatrix } from "storify"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const AllVariants = storyMatrix({
  schema: z.object({
    variant: z.enum(["default", "secondary", "outline", "ghost"]),
    size: z.enum(["sm", "default", "lg"]),
  }),
  render: (props) => <Button {...props}>Button</Button>,
})
// Generates 4 variants × 3 sizes = 12 stories automatically
```

## Zod Schema Patterns

| Type | Pattern | UI Control |
|------|---------|------------|
| String | `z.string().default("text")` | Text input |
| Number | `z.number().default(0)` | Number input |
| Boolean | `z.boolean().default(false)` | Checkbox |
| Enum | `z.enum(["a", "b"]).default("a")` | Select dropdown |
| Optional | `z.string().optional()` | Input with clear |

## File Conventions

- Story files: `*.story.tsx`
- Location: `app/ui/stories/`
- One component per story file
- Export multiple variants from same file

## Best Practices

1. **Always provide defaults** — Use `.default()` on schema fields
2. **Use descriptive export names** — `Default`, `WithIcon`, `Disabled`
3. **Group related variants** — Keep all Button stories in `button.story.tsx`
4. **Use storyMatrix for exhaustive testing** — Cover all prop combinations

<!-- STORIFY:END -->

<!-- Add your project-specific instructions below -->
```

---

## Notes

### Future Enhancements

- Generate `.cursorrules` format on demand (flag: `--cursor`)
- Auto-detect existing AI instruction files and offer to merge
- Include component discovery hints based on actual project structure
