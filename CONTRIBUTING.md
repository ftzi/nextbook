# Contributing to Storify

Thanks for your interest in contributing to storify!

## Development Setup

```bash
# Clone the repo
git clone https://github.com/ftzi/storify.git
cd storify

# Install dependencies (requires Bun 1.3+)
bun install

# Run checks
bun ok
```

## Project Structure

```
packages/storify/    # The main library
apps/nextjs/         # Marketing website + stories (Next.js)
```

## Commands

| Command | Description |
|---------|-------------|
| `bun ok` | Run type check, lint, and tests (use this!) |
| `bun ts` | Type check only |
| `bun lint` | Lint and format |
| `bun test` | Run unit tests |
| `bun e2e` | Run Playwright e2e tests |
| `bun build` | Build all packages |

**Always run `bun ok` before committing.** It must pass.

## Code Style

- **TypeScript strict mode** — No `any`, no implicit types
- **Biome** — Formatting and linting (runs via `bun lint`)
- **No barrel files** — Import directly from source files
- **Object parameters** — Prefer `fn({ name, age })` over `fn(name, age)`
- **Zero dependencies** — Never add runtime dependencies to the storify package

## Pull Request Process

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `bun ok` — it must pass
4. Write/update tests if applicable
5. Open a PR with a clear description

## What Makes a Good PR

- **Focused** — One feature or fix per PR
- **Tested** — Unit tests for utilities, e2e for UI behavior
- **Documented** — Update README if API changes
- **Clean** — No debug logs, no commented code

## Zero Dependencies Rule

The storify package has **zero runtime dependencies**. This is intentional and non-negotiable. If you need functionality:

1. Implement it inline
2. Use a peer dependency the user already has (next, react, zod)
3. Reconsider if the feature is necessary

## Questions?

Open an issue or discussion. We're happy to help!
