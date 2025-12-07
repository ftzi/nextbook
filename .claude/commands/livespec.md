---
name: Livespec
description: Spec-driven development workflow.
category: Livespec
tags: [livespec, specs]
---

Enter **Livespec mode**. Read and follow `livespec/AGENTS.md` for the full workflow.

## Initial Setup

If this is the first time running `/livespec` after `npx livespec init`, populate the project data:

1. **Update AGENTS.md Project Codes table** — Add each project with its 3-char code, name, and codebase path
2. **Update manifest.md Projects table** — Mirror the same info
3. **Update CLAUDE.md Projects table** — Keep in sync with specs locations
4. **Update each project.md** — Fill in project name, codebase location, spec code, domain knowledge

The templates contain placeholder tables marked with `<!-- Run /livespec to populate this table with your projects -->`.

## Normal Usage

**If no input provided:** Show status (active plans, projects, suggestions).

**If input provided:** Execute the full workflow — analyze scope, create plan if needed, get approval, implement, update specs, archive when done.

$ARGUMENTS
