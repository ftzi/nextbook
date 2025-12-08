# Contributing to Storify

Thanks for your interest in contributing to Storify! This document outlines how to get started.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/storify.git
   cd storify
   ```

2. **Install Bun** (if not already installed)
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Run checks**
   ```bash
   bun ok
   ```

## Project Structure

This is a Turborepo monorepo:

- `packages/storify/` — The main library (published as `@ftzi/storify`)
- `apps/nextjs/` — Marketing website and example stories

## Making Changes

### Before You Start

- Check if there's an existing issue for your change
- For significant changes, open an issue first to discuss

### Code Style

- **TypeScript strict mode** — No `any` types
- **Biome** — Run `bun lint` to format and check code
- **No dependencies** — The storify package has zero runtime dependencies

### Running Tests

```bash
# Type checking and linting
bun ok

# Unit tests only
bun test

# E2E tests (starts dev server automatically)
bun e2e
```

### Commit Messages

- Use clear, descriptive commit messages
- Reference issue numbers when applicable

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `bun ok` to verify all checks pass
5. Push to your fork
6. Open a Pull Request

### PR Requirements

- [ ] All checks pass (`bun ok`)
- [ ] Unit tests added/updated if applicable
- [ ] Documentation updated if needed
- [ ] No breaking changes without discussion

## Questions?

Feel free to open an issue if you have questions or need help getting started.
