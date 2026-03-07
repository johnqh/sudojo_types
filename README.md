# @sudobility/sudojo_types

Shared TypeScript type definitions for the Sudojo Sudoku learning platform.

## Installation

```bash
bun add @sudobility/sudojo_types
```

## Usage

```typescript
import type { Board, Daily, Level, Technique, TechniqueId } from '@sudobility/sudojo_types';
import { successResponse, errorResponse } from '@sudobility/sudojo_types';
import { techniqueToBit, hasTechnique, addTechnique } from '@sudobility/sudojo_types';
```

## Types

- **Entities**: `Board`, `Daily`, `Level`, `Technique`, `UserProgress`, `Challenge`
- **Enums**: `TechniqueId` (60 solving techniques)
- **Requests/Responses**: Create/update types for boards, dailies, levels, techniques
- **Utilities**: `ApiResponse<T>`, `PaginatedResponse<T>`, `successResponse()`, `errorResponse()` (re-exported from `@sudobility/types`)
- **BigInt helpers**: `techniqueToBit()`, `hasTechnique()`, `addTechnique()` for technique bitmask fields

## Development

```bash
bun run build        # Build ESM + CJS
bun run test         # Run tests once
bun run typecheck    # TypeScript check
bun run lint         # ESLint
bun run verify       # Typecheck + lint + test + build
```

## Related Packages

- `@sudobility/sudojo_client` -- React Query hooks for Sudojo API
- `@sudobility/sudojo_lib` -- Business logic and game state hooks
- `sudojo_api` -- Backend API server
- `sudojo_app` / `sudojo_app_rn` -- Web and mobile apps

## License

BUSL-1.1
