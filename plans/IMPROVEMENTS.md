# Improvement Plans for @sudobility/sudojo_types

## Priority 1 - High Impact

### 1. Add JSDoc to Entity Types and Request/Query Types
- Entity types (`Level`, `Technique`, `Learning`, `Board`, `Daily`, `Challenge`) lack JSDoc comments explaining what each interface represents and the semantics of their fields.
- Request body types (`LevelCreateRequest`, `BoardUpdateRequest`, etc.) have no documentation on field constraints, valid ranges, or expected formats.
- Query parameter types (`BoardQueryParams`, `ChallengeQueryParams`, etc.) do not document what each filter does or what values are acceptable.
- The `techniques` bitfield on `Board` and `Daily` is particularly complex and deserves inline JSDoc on the field itself explaining its bitmask nature.
- Gamification types (`GameSession`, `GameStartRequest`, `GameFinishResponse`, `PointTransaction`) are missing JSDoc entirely; consumers need to understand the flow (start -> hint -> finish) from the types alone.
- `BadgeDefinitionCreateRequest` and `BadgeDefinitionUpdateRequest` use `?` syntax instead of the project's `Optional<T>` convention, which should be documented as an intentional exception or migrated.

### 2. Expand Test Coverage for Utility Functions
- The `techniqueToBit`, `hasTechnique`, and `addTechnique` BigInt bitfield utilities have zero test coverage despite being critical for correctness with IDs >= 32.
- Board utility functions `parseBoardString` and `stringifyBoard` have basic tests but do not cover edge cases like all-zeros boards, all-nines boards, or boards with dots mixed with digits.
- The UUID validation functions (`isValidUUID`, `validateUUID`) have no tests in `index.test.ts`.
- Cell notation utilities (`cellName`, `cellList`, `getBlockIndex`, `getBlockNumber`, `indexToRowCol`, `rowColToIndex`) have no test coverage.
- Time formatting utilities (`formatTime`, `parseTime`) have no tests.
- `formatDigits` function has no tests.
- `getTechniqueIconUrl` has no tests to verify the name-to-URL conversion logic.
- The test file has type test assertions that reference fields (`index`, `level_uuid`, `technique_uuid`) that no longer exist in the current interfaces, indicating the type tests are stale and need to be updated.

### 3. Improve Type Safety for Bitfield Operations
- The `techniques` field on `Board`, `Daily`, and `TechniqueExample` is typed as `number | null`, but values can exceed `Number.MAX_SAFE_INTEGER` for puzzles using techniques with IDs >= 53 (since 2^53 is the limit). The comment in CLAUDE.md acknowledges this ("With 60 techniques, values can exceed Number.MAX_SAFE_INTEGER") but the utility functions return `number`, not `bigint`.
- `techniqueToBit` converts BigInt back to Number, which silently loses precision for technique IDs >= 53. Consider providing a `bigint` variant or documenting the safe range explicitly.
- The `TECHNIQUE_ID_TO_TITLE` map uses `Record<number, string>` instead of `Record<TechniqueId, string>`, losing type narrowing benefits.

## Priority 2 - Medium Impact

### 4. Reduce Single-File Monolith Architecture
- All types, interfaces, enums, constants, and utility functions live in a single 1920-line `src/index.ts` file. This makes navigation difficult and increases the risk of merge conflicts.
- Consider splitting into separate files by domain: `entities.ts`, `requests.ts`, `queries.ts`, `solver.ts`, `belt.ts`, `scramble.ts`, `board-utils.ts`, `gamification.ts`, with barrel re-export from `index.ts`.
- The SVG path data constants (`BELT_ICON_PATHS`) and the `getBeltIconSvg` function with its inline SVG generation are presentation-layer concerns that could be separated from pure data types.

### 5. Add Runtime Validation for Board Strings
- Functions like `isBoardFilled`, `isBoardSolved`, and `getMergedBoardState` assume inputs are valid 81-character strings but do not validate this. Passing shorter strings silently produces incorrect results.
- `scrambleBoard` calls `parseBoardString` which validates, but direct callers of the solver utilities may pass malformed strings.
- Consider adding lightweight assertions or optional validation mode for these public utility functions.

### 6. Standardize Date Handling
- `Daily.date` is typed as `string` but represents a date (YYYY-MM-DD format). A branded type or JSDoc annotation would help prevent passing arbitrary strings.
- Entity timestamps are typed as `Date | null`, but API responses serialize dates as ISO strings. This mismatch can cause runtime errors if consumers assume they receive `Date` objects.

## Priority 3 - Nice to Have

### 7. Add Deprecation Documentation for Legacy Patterns
- The `ScrambleResult.digitMapping` and `reverseDigitMapping` use `Map<number, number>`, which does not serialize to JSON. Document this limitation for consumers who may try to persist scramble results.
- The `shuffleArray` function is a private utility using `Math.random()`, which is not cryptographically secure and not seedable. Document that scramble results are non-deterministic and intended for visual variety, not security.

### 8. Add Stricter Branded Types for Domain Values
- Many fields use plain `string` or `number` where a branded type would prevent misuse: board strings (81-char), UUIDs, technique IDs, level numbers, date strings.
- For example, `Board.board` and `Board.solution` are both `string` and could be accidentally swapped. A `BoardString` branded type would catch this at compile time.
- `TechniqueId` enum values (1-60) are used interchangeably with plain `number` throughout; stronger typing could prevent passing arbitrary numbers where technique IDs are expected.

### 9. Export Type Guards and Assertion Functions
- Provide exported type guards like `isBoard()`, `isDaily()`, `isChallenge()` for runtime type discrimination, especially useful when consuming API responses that may return different entity shapes.
- The `HINT_LEVEL_LIMITS` constant is typed with `as const` but there is no helper function to check hint access given a user's entitlement level; this logic currently lives in consumer code and could be centralized here.
