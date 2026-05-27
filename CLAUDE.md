# CLAUDE.md

This file provides context for AI assistants working on this codebase.

## Project Overview

`@sudobility/sudojo_types` is the central TypeScript types package for the Sudojo ecosystem (a Sudoku learning platform). It is the **shared type contract** consumed by all other Sudojo packages:

- **Entity types** — database models (Board, Daily, Level, Technique, Learning, Challenge, etc.)
- **Request/response types** — create/update requests, query parameters, API response shapes
- **Solver types** — SolverHintStep, SolverHints, SolveData, LocalizedHint for the hint system
- **Gamification types** — GameSession, GameStartRequest, GameFinishRequest/Response, PointTransaction, badges
- **Subscription/entitlement types** — HintAccessDeniedError, entitlement parsing, subscription tier helpers
- **Utility functions** — board manipulation, technique bitfields, belt system SVG, scrambling, time formatting, UUID validation, cell notation

Published to npm under `@sudobility` scope with **public** access.

## Runtime & Package Manager

**This project uses Bun.** Do not use npm, yarn, or pnpm.

```bash
bun install           # Install dependencies
bun run verify        # Run all checks (typecheck, lint, test, build)
bun run typecheck     # Type-check without emitting
bun run lint          # Run ESLint
bun run lint:fix      # Run ESLint with auto-fix
bun run format        # Format code with Prettier
bun run format:check  # Check formatting without changes
bun run build         # Build ESM and CJS outputs to dist/
bun run clean         # Remove dist/
bun run dev           # Watch mode for development
bun run test          # Run tests once
bun run test:watch    # Run tests in watch mode
bun run test:coverage # Run tests with coverage
```

## File Structure

```
src/
  index.ts       # All types and utilities (single entry point, ~2300 lines)
  index.test.ts  # Comprehensive tests (~1700 lines)
dist/
  index.js       # ESM build
  index.cjs      # CommonJS build
  index.d.ts     # Type declarations
  *.map          # Source maps and declaration maps
```

**Single-file strategy**: Everything lives in `src/index.ts`, organized into clearly commented sections.

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
2. Entity Types (Board, Daily, Level, Technique, Learning, Challenge, etc.)
3. Request Body Types (Create/Update requests)
4. Query Parameter Types
5. Response Helper Types and functions (`successResponse()`, `errorResponse()`)
6. Solver Types (SolverHintStep, SolverHints, SolveData, LocalizedHint)
7. Gamification Types (GameSession, points, badges, user stats)
8. Entitlement/Subscription Types and helpers
9. Utility Functions (board, belt, scramble, time, cell notation)

### Naming Conventions

- **Request types**: `{Entity}CreateRequest`, `{Entity}UpdateRequest`
- **Query types**: `{Entity}QueryParams`
- **Response types**: `{Entity}Data` or direct interfaces
- **Utility functions**: camelCase (`isBoardSolved`, `getTechniqueNameById`, `parseBoardString`)
- **Constants**: UPPER_SNAKE_CASE (`BOARD_SIZE`, `TOTAL_CELLS`, `EMPTY_BOARD`)
- **Enums**: PascalCase with PascalCase members (`TechniqueId.FULL_HOUSE`)

### BigInt Technique Bitfields

The `techniques` field on `Board` and `Daily` entities is a bitmask where each bit corresponds to a `TechniqueId` enum value. With 60 techniques, values can exceed `Number.MAX_SAFE_INTEGER`. The utility functions use `BigInt` internally:

```typescript
import { techniqueToBit, hasTechnique, addTechnique } from '@sudobility/sudojo_types';

const bit = techniqueToBit(42);          // Uses BigInt internally
const has = hasTechnique(bitfield, 42);  // Safe for IDs >= 32
```

### Board Utilities

81-character strings (`'0'-'9'` or `'.'` for empty):

```typescript
parseBoardString(str)      // → 9x9 number array
stringifyBoard(board)      // ← 9x9 array to string
isValidBoardString(str)    // Format validation
isBoardFilled(str)         // No empty cells?
isBoardSolved(str, sol)    // Matches solution?
getMergedBoardState(...)   // Merge clues + input
```

### Belt System (Gamification)

12 levels map to 12 karate belts (White → Black) with optional stripes:

```typescript
BELT_COLORS              // Color definitions per level
getBeltIconSvg(level)    // Dynamic SVG with color fill + stripe
```

### Scramble System

`scrambleBoard(puzzle, solution, config)` returns scrambled puzzle/solution, digit mapping as `Map<number, number>`, and supports partial scrambling via `ScrambleConfig`. Uses Fisher-Yates shuffle.

### Entitlement Helpers

```typescript
parseEntitlements(csv)          // CSV to array
hasRequiredEntitlement(user, req) // Check access
getSubscriptionOfferId(ent)     // Map to RevenueCat offering
```

Subscription tiers: free (hint level ≤3), blue_belt (≤5), red_belt (unlimited).

### Code Style

- Single quotes, semicolons, trailing commas (es5)
- 80 character line width, 2 space indentation
- Run `bun run format` before committing

## Testing

Tests are in `src/index.test.ts` using Vitest. The test suite covers:
- **Helper functions**: `successResponse()` and `errorResponse()` runtime behavior
- **Type tests**: Compile-time validation using `expectTypeOf()` to ensure types have correct shapes
- **Board utilities**: `parseBoardString()`, `stringifyBoard()`, `isValidBoardString()`, edge cases
- **Scramble system**: Preservation of clues, valid Sudoku structure after scrambling
- **Solver utilities**: `isBoardFilled()`, `isBoardSolved()`, `getMergedBoardState()`
- **Belt system**: Color mapping, SVG generation
- **Cell notation**: `cellName()`, `getBlockIndex()`, `rowColToIndex()`
- **Time formatting**: `formatTime()`, `parseTime()`
- **UUID validation**

When adding new types, add corresponding type tests to verify the shape is correct.

## Dependencies

- `@sudobility/types` (peer dependency): Shared types library — provides `Optional<T>`, `ApiResponse`, `BaseResponse`, `SubscriptionPlatform`, etc.
- `typescript`: Build tooling
- `vitest`: Testing framework
- `eslint` + `@typescript-eslint/*`: Linting
- `prettier` + `eslint-plugin-prettier`: Code formatting
- `rimraf`: Clean script
- `globals`: ESLint globals

**No external runtime dependencies** — this is a types-only package.

## CI/CD

GitHub Actions workflow delegates to `johnqh/workflows` unified CI/CD pipeline. Runs on push/PR to `main` and `develop`:
- Runs typecheck, lint, test, build
- Auto-publishes to npm on version bump (requires `NPM_TOKEN` secret)

## Publishing

Package is published to npm under `@sudobility` scope with public access.

**Manual**: Run `npm publish` (triggers `prepublishOnly` → clean + verify + build)

**Automatic**: Bump version in `package.json` and push to `main` — CI/CD will publish automatically.

## Common Tasks

### Add New Type
1. Define the type in `src/index.ts` in the appropriate section
2. Export it from the file
3. Add type tests in `src/index.test.ts`
4. Run `bun run verify` to ensure everything passes

### Add New Utility Function
1. Add the function in `src/index.ts` in the utilities section
2. Export it
3. Add runtime tests in `src/index.test.ts`
4. Run `bun run verify`

### Update Existing Type
1. Modify the type definition
2. Update any dependent types
3. Update tests to reflect changes
4. Run `bun run verify`
