# CLAUDE.md

This file provides context for AI assistants working on this codebase.

## Project Overview

`@sudobility/sudojo-types` is a TypeScript types package for the Sudojo API (a Sudoku learning platform). It contains:
- Entity types (database models)
- Request/response types for API endpoints
- Query parameter types
- Helper functions for creating responses

## Commands

```bash
npm run verify       # Run all checks (typecheck, lint, test, build)
npm run typecheck    # Type-check without emitting
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check formatting without changes
npm run build        # Build ESM and CJS outputs to dist/
npm run clean        # Remove dist/
npm run dev          # Watch mode for development
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
```

## Code Conventions

### Optional Fields

Use `Optional<T>` from `@sudobility/types` for optional fields in request/query types:

```typescript
// Correct
interface UpdateRequest {
  name: Optional<string>;
  value: Optional<number>;
}

// Incorrect - do not use ?
interface UpdateRequest {
  name?: string;
  value?: number;
}
```

### Nullable Database Fields

Entity types representing database models use `| null` for nullable columns:

```typescript
interface Entity {
  uuid: string;           // Required, non-null
  text: string | null;    // Nullable column
  created_at: Date | null;
}
```

### Type Organization

Types in `src/index.ts` are organized into sections:
1. Re-exports from `@sudobility/types`
2. Entity Types (database models)
3. Request Body Types (Create/Update requests)
4. Query Parameter Types
5. Response Helper Types

### Code Style

- Single quotes, semicolons, trailing commas (es5)
- 80 character line width, 2 space indentation
- Run `npm run format` before committing

## Testing

Tests are in `src/index.test.ts` using Vitest. The test suite covers:
- **Helper functions**: `successResponse()` and `errorResponse()` runtime behavior
- **Type tests**: Compile-time validation using `expectTypeOf()` to ensure types have correct shapes

When adding new types, add corresponding type tests to verify the shape is correct.

## Dependencies

- `@sudobility/types`: Shared types library (peer dependency) - provides `Optional<T>`, `ApiResponse`, `BaseResponse`, etc.
- `typescript`: Build tooling
- `vitest`: Testing framework
- `eslint`: Linting
- `prettier`: Code formatting
- `rimraf`: Clean script

## File Structure

```
src/
  index.ts       # All types exported from single entry point
  index.test.ts  # Tests for types and helper functions
dist/
  index.js       # ESM build
  index.cjs      # CommonJS build
  index.d.ts     # Type declarations
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on push/PR to `main` and `develop`:
- Runs typecheck, lint, test, build
- Auto-publishes to npm on version bump (requires `NPM_TOKEN` secret)

## Publishing

Package is published to npm under `@sudobility` scope with public access.

**Manual**: Run `npm publish` (triggers `prepublishOnly` to verify and build)

**Automatic**: Bump version in `package.json` and push to `main` - CI/CD will publish automatically.
