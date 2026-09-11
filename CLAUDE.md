# CLAUDE.md

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it.

This file provides context for AI assistants working on this codebase.

## Project Overview

`@sudobility/sudojo_types` is the **shared type contract** for the Sudojo Sudoku-learning family. It holds:

- entity, request, query and response types for `sudojo_api`
- mirrors of the C# solver's JSON (`sudojo_solver`)
- gamification and entitlement types
- a small set of pure runtime utilities: board strings, technique bitmasks, belts, scrambling, cell notation, time, and UUID

Everything is in one source file. The package is ESM-only and published to npm with **public** access. Any type change can break about 10 sibling repos (see [Consumers](#consumers)).

## Commands

**This project uses Bun** (`bun.lock`). Do not use npm, yarn, or pnpm locally.

| Command | What it runs | Verified 2026-09-10 |
|---|---|---|
| `bun install` | install deps | not run |
| `bun run typecheck` | `tsc --noEmit` (tsconfig.json, which excludes `*.test.ts`) | passes |
| `bun run lint` / `lint:fix` | `eslint src --ext .ts` with **`eslint.config.js`** (this config also lints tests) | clean |
| `bun run format` / `format:check` | Prettier on `src/**/*.{ts,js,json,md}` | check clean |
| `bun run test` / `test:watch` | `vitest run` / `vitest` on `src/index.test.ts` | 246/246 pass |
| `bun run test:coverage` | `vitest --coverage` | **broken**: `@vitest/coverage-v8` is not a devDependency |
| `bun run build` | `tsc -p tsconfig.esm.json` → `dist/index.{js,d.ts}` plus maps (**ESM only**) | compiles (verified to a scratch `--outDir`) |
| `bun run clean` | `rimraf dist` | not run |
| `bun run dev` | `tsc --watch` on tsconfig.json (`noEmit: true`): **watch-mode typecheck, emits nothing** | not run |
| `bun run verify` | typecheck → lint → test → build | the four steps above |

### Release / publish (document only; never run unless the user explicitly asks)

1. **Family release:** run `~/projects/sudojo_app/scripts/push_all.sh`. `sudojo_types` comes first in its `PROJECTS` list and has a 60 s wait so CI can publish before dependents resolve it. For each repo the script updates `@sudobility/*` deps to latest, runs format, then typecheck/lint/test/build, bumps the patch version, commits, and pushes.
2. **CI:** `.github/workflows/ci-cd.yml` calls `johnqh/workflows/.github/workflows/unified-cicd.yml@main` with `npm-access: public`. It runs on push and PR to `main` and `develop`.
   - On `develop` it runs tests only.
   - Elsewhere it runs `npm publish --access public` if `NPM_TOKEN` is set and the `package.json` version is not already on npm.
3. `prepublishOnly` is `bun run clean && bun run verify`.
4. `package.json` `files` = `dist/**/*` + **`CLAUDE.md`**, so this file ships in the npm tarball.

Commit style from `git log`: `feat: …`, `fix: …`, `chore: release 1.2.x (…)`, `chore: bump @sudobility/types to X and bump version to Y`.

## Repo Map

```
src/index.ts          every export (~2810 lines, banner-comment sections; see table below)
src/index.test.ts     vitest: runtime tests + expectTypeOf shape tests (~2140 lines, 246 tests)
dist/                 build output (gitignored). A local dist/index.cjs is a stale leftover: the CJS
                      build was removed in 1.2.37, it is not exported, and `clean` deletes it
plans/IMPROVEMENTS.md improvement backlog (partly stale, see Gotchas)
.github/workflows/ci-cd.yml   thin caller of johnqh/workflows unified CI/CD
eslint.config.js      ACTIVE ESLint flat config (TS + prettier plugin, lints tests)
eslint.config.mjs     DEAD: ESLint 9 resolves eslint.config.js first
tsconfig.json         typecheck config (ES2020, strict, noEmit, excludes tests)
tsconfig.esm.json     build config (extends tsconfig.json, emits to dist/)
.prettierrc           single quotes, semicolons, es5 trailing commas, 80 cols, 2 spaces
```

## Exported Groups (in `src/index.ts` order)

| Section banner | Exports |
|---|---|
| Re-exports | types `ApiResponse`, `BaseResponse`, `Optional`, `PaginatedResponse`, `PaginationInfo`, `PaginationOptions`; runtime enum `SubscriptionPlatform` (all from `@sudobility/types`) |
| Entity Types | `ISODateString`, `Level`, `Technique`, `Learning`, `Board`, `Daily`, `Challenge`, `Community`, `Strategy` |
| Request Body Types | `{Level,Technique,Learning,Board,Daily,Challenge,Community,Strategy}{Create,Update}Request` |
| Query Parameter Types | `CommunityQueryParams`, `TechniqueQueryParams`, `LearningQueryParams`, `BoardQueryParams`, `ChallengeQueryParams`, `TechniqueExampleQueryParams` |
| Counts Response Types | `BoardCountsData`, `BoardCountsByTechniqueData`, `ExampleCountsData`, `UpdateStatsData`, `OCRExtractData`, `PracticesBulkDeleteData`, `PracticeRegenerateFailure`, `PracticesRegenerateHintsData` |
| Response Helpers / Health | `successResponse()`, `errorResponse()` (defined here, not re-exported; they return `BaseResponse` with `timestamp`), `HealthCheckData` |
| Subscription (RevenueCat) | `RevenueCatEntitlement`, `SubscriptionResult` |
| Solver Types | `SolverPencilmark`, `SolverBoard`, `SolverAreaType`, `SolverColor`, `SolverHintArea`, `SolverCellActions`, `SolverHintCell`, `SolverLinkType`, `SolverLink`, `SolverCellGroup`, `LocalizedHint`, `SolverHintStep`, `SolverHints`, `HintPointsEarned`, `SolveData`; raw solver envelope `SOLVER_ERROR_CODES`, `SolverErrorCode`, `SolverErrorPayload`, `SolverResult<T>` |
| Hint Access Control | `HintAccessUserState`, `HintEntitlement`, `HintAccessDeniedError`, `HintAccessDeniedResponse`, `HINT_LEVEL_LIMITS` (**deprecated**) |
| Entitlement Utilities | `parseEntitlements()`, `hasRequiredEntitlement()`, `getSubscriptionOfferId()`. The solver's `ValidateBoardData`, `ValidateData`, `GenerateData` also sit under this banner |
| Technique Bitfield | `TechniqueId` enum (1–60, same names and values as solver `SudokuTechnique`, no 0 member), `ALL_TECHNIQUE_IDS`, `techniqueToBit()`; exact BigInt helpers `parseTechniqueBitmask()`, `techniqueBitmaskOf()` + `TechniqueBitmaskSource`, `hasTechniqueInBitmask()`, `techniqueIdsFromBitmask()`, `techniqueIdsToBitmask()`, `formatTechniqueBitmask()`; **deprecated** lossy `hasTechnique()`, `addTechnique()` |
| Technique Examples / Practices | `TechniqueExample`, `TechniqueExample{Create,Update}Request`, `TechniquePractice`, `TechniquePracticeCreateRequest`, `TechniquePracticeCountItem` |
| Belt System | `Belt`, `BELT_COLORS` (levels 1–12), `getBeltForLevel()`, `getAllBelts()`, `BELT_ICON_PATHS`, `BELT_ICON_VIEWBOX`, `getBeltIconSvg()`, `getBeltIconForLevel()` |
| Board Utilities | `BOARD_SIZE`, `BLOCK_SIZE`, `TOTAL_CELLS`, `parseBoardString()`, `stringifyBoard()`, `isValidBoardString()` |
| Scramble Utilities | `ScrambleConfig`, `DEFAULT_SCRAMBLE_CONFIG`, `ScrambleResult`, `scrambleBoard()`, `noScramble()` |
| Solver Utilities | `isBoardFilled()`, `isBoardSolved()`, `getMergedBoardState()`, `hasInvalidPencilmarksStep()`, `hasPencilmarkContent()`, `getTechniqueNameById()` |
| Board State Constants | `EMPTY_BOARD` (81 × `0`), `EMPTY_PENCILMARKS` (80 commas = 81 empty entries) |
| Cell Notation / Time / UUID | `cellName()` (`R1C1`, uppercase), `cellList()`, `getBlockIndex()`, `getBlockNumber()`, `indexToRowCol()`, `rowColToIndex()`; `formatTime()`, `parseTime()`, `formatDigits()`; `isValidUUID()`, `validateUUID()` |
| Solver API Option Types | `SolveOptions`, `ValidateOptions`, `GenerateOptions`: client → `sudojo_api` options (used by `sudojo_client`), **not** the solver's query params |
| Technique URL | `getTechniqueIconUrl()` → `/technique.<title, lowercased, spaces/hyphens→dots>.svg` |
| Gamification | `UserStats`, `BadgeDefinition`, `EarnedBadge`, `GameSession`, `GameStartRequest`, `GameStartResponse`, `GameFinishRequest`, `GameFinishPoints`, `GameFinishLevel`, `NewBadge`, `GameFinishResponse`, `GamificationStats`, `PointTransaction`, `BadgeDefinition{Create,Update}Request` |

Totals: 96 exported interfaces/types, 41 functions, 12 consts, and 1 enum, plus 7 re-exports.

Signatures that are easy to get wrong:

```ts
isBoardFilled(original, user)             // user digit wins; no length check, missing chars = '0'
isBoardSolved(original, user, solution)
getMergedBoardState(original, user)       // 81-char merged string
hasRequiredEntitlement(levelEntitlement, userEntitlements)  // CSV, ANY-of; null/'' = free
getSubscriptionOfferId(entitlement)       // has blue_belt → '1_blue_belt'; else '8_red_belt'; none → undefined
getBeltIconSvg(fill, width = 100, height = 40, strokeColor?, stripeColor?)
getBeltIconForLevel(level, width?, height?)  // null outside 1–12
scrambleBoard(puzzle, solution, config = DEFAULT_SCRAMBLE_CONFIG)  // Math.random; Map digit mappings
parseBoardString(s)  // accepts '0' or '.', throws on bad input; stringifyBoard always writes '0'
```

## Conventions

- **Entities** (DB models) use `T | null` for nullable columns. Timestamps are typed `Date | null`, but the JSON carries ISO strings.
- **Request/query types** use required keys typed `Optional<T>` (`= T | undefined | null`), e.g. `name: Optional<string>`. Existing exceptions use `?`:
  - `CommunityUpdateRequest`, `StrategyUpdateRequest`, `CommunityQueryParams`, `BadgeDefinition{Create,Update}Request`
  - every `difficulty_score?: Optional<number>`, made optional for back-compat in commit 1089088

  When you add a field to a type that is already published, make it `?` so dependents don't break.
- **Mirror the wire casing exactly.** Use snake_case for DB/API entity and solver board fields (`difficulty_score`, `board_uuid`). Use camelCase for gamification and subscription types (`difficultyScore`, `sessionId`) and for solver link coordinates (`fromRow`).
- **Naming:** `{Entity}CreateRequest` / `{Entity}UpdateRequest` / `{Entity}QueryParams` / `{Thing}Data` for payloads. Functions are camelCase and constants UPPER_SNAKE_CASE. The `TechniqueId` enum is PascalCase with UPPER_SNAKE_CASE members.
- Put new exports in the matching banner section and give each field a JSDoc comment. Add an `expectTypeOf` shape test for types and runtime tests for functions in `src/index.test.ts`, then run `bun run verify`.
- **Single-file layout:** keep it unless the owner decides otherwise. `plans/IMPROVEMENTS.md` #4 proposes a split.

## Solver JSON Contract

The authority is `~/projects/sudojo_solver`: `SudokuApi/Models/{Board,Hint,Result}Models.cs`, `docs/API.md` and `docs/HINT.md`. Clients never call the solver directly. `sudojo_api` (`src/services/solver-proxy.ts`, `src/routes/solver.ts`) proxies it at `/api/v1/solver/{solve,validate,generate}`. The proxy rewraps the solver envelope into `successResponse()` / `errorResponse(string)` and changes some fields (marked "proxy" below).

| TS type | C# source | Wire notes |
|---|---|---|
| `SolveData` | `SolveData` | `{board, hints}`. **proxy** adds `points?: HintPointsEarned` (2 × level) |
| `SolverBoard` / `SolverPencilmark` | `SolverBoard` / `SolverPencilmark` | state **after** the last step. `numbers` = 81 comma-separated entries |
| `SolverHints` | `SolverHints` | `technique` (0 = autopencil/correction hint), `level`, `difficulty_score`, `steps` |
| `SolverHintStep` | `SolverHintStep` | `links`, `groups`, `digit`, `localization` are **omitted** when empty. `areas`/`cells` are `null` in the autopencil hint |
| `SolverCellActions` | `SolverCellActions` | `select`/`unselect` use `"0"` for none. `add`/`remove`/`highlight` use `""` for none (digit strings like `"137"`) |
| `SolverLink` | `SolverLink` | `type`: `strong` \| `weak` \| `conflict` |
| `LocalizedHint` | `LocalizedHint` | `{stringKey, values: string[]}` |
| `ValidateData` / `GenerateData` | `ValidateData` | `{board: ValidateBoardData}` |
| `ValidateBoardData` | `ValidateBoardData` | `techniques` is a C# `ulong` (lossy in JS); `techniques_bitmask` is the same value as an exact base-10 string. `difficulty_score` is always sent (0 from `/generate`). `solution` has `0` at given cells |
| `SolverResult<T>` / `SolverErrorPayload` / `SOLVER_ERROR_CODES` | `SolveResult` / `ValidateResult` / `ErrorPayload` | raw envelope `{success, error, data}`, seen only by `sudojo_api`. `code` is an **integer** 0–3 (Unknown, AutoPencilmarksRequired, CannotSolve, MultipleSolutions) |

### Known contract gaps

Audited 2026-09-10 against what consumers actually receive (solver JSON → `sudojo_api` proxy → clients). Only non-breaking changes were made here.

**Fixed in this repo**

- **#1 `SolverHints.difficulty_score`.** Added as optional `difficulty_score?: number`. The solver always sends it and the proxy passes it through, but stored `hint_data` may predate it.
- **#4 Solver error payload type.** Added `SOLVER_ERROR_CODES`, `SolverErrorCode` (`0|1|2|3`), `SolverErrorPayload` and `SolverResult<T>` for the raw envelope. Only `sudojo_api` sees it; clients get `errorResponse("<code>: <message>")`.
- **#7 `ValidateBoardData.solution` JSDoc.** It now says givens are `'0'` and to merge with `getMergedBoardState(original, solution)`.
- **#9 `SolverHints.technique` JSDoc.** Ids corrected (1 = FULL_HOUSE, 2 = HIDDEN_SINGLE, 3 = NAKED_SINGLE), and 0 is documented for autopencil and correction hints. `TechniqueId` keeps no 0 member on purpose: adding one would change `ALL_TECHNIQUE_IDS` / `Object.values(TechniqueId)` for every consumer.
- **#10 Option types (partly fixed).** `SolveOptions.filters` and `ValidateOptions.autoPencilmarks` are now `@deprecated` because nothing reads them. None of the consumers lint for deprecations.
- **#6 Technique bitmasks: exact BigInt strings (decided 2026-09-10).** The numeric fields are lossy once any id ≥ 54 is set, because JSON parsing drops low bits. The solver and `sudojo_api` now also send an exact base-10 string companion, and the types mirror it as optional fields, since older deployments omit it:
  - `Board.techniques_bitmask?: string | null` and `Daily.techniques_bitmask?: string | null` (`null` when `techniques` is null)
  - `ValidateBoardData.techniques_bitmask?: string`, which covers `ValidateData` and `GenerateData`
  - `TechniqueExample.techniques_bitfield_bitmask?: string`

  **Usage:**
  - Read: `const mask = techniqueBitmaskOf(obj)`. It prefers the string and falls back to the number, and returns `0n` for null or missing.
  - Test: `hasTechniqueInBitmask(mask, id)` or `techniqueIdsFromBitmask(mask)`.
  - Build: `techniqueIdsToBitmask(ids)`. Send: `formatTechniqueBitmask(mask)`. Parse any wire value: `parseTechniqueBitmask(v)`.
  - All of these throw `RangeError` on negative or non-integer input and on malformed strings.

  `hasTechnique()` and `addTechnique()` are `@deprecated`; `techniqueToBit()` is not, because one bit is always exact. Numeric fields are never removed.

  **Requests** accept `number | string`, matching `sudojo_api`'s `bitmask` zod schema and `parseBitmask`. Optionality and nullability are unchanged: `Board{Create,Update}Request.techniques`, `Daily{Create,Update}Request.techniques`, `TechniqueExampleUpdateRequest.techniques_bitfield` and `BoardQueryParams.{techniques,technique_bit}` are `Optional<number | string>`, while `TechniqueExampleCreateRequest.techniques_bitfield` and `GameStartRequest.techniques` are `number | string`. Send `formatTechniqueBitmask(mask)` whenever an id ≥ 54 is set. The API treats `null` as 0 and rejects `""`, negatives and non-integers. Example bitfields must be ≥ 1, so a `null` update is rejected even though `Optional` allows it.

  `sudojo_api/src/lib/bitmask.ts` has local `TODO(sudojo_types)` response types. They match these types field for field; the only difference is that its `<field>_bitmask` companions are required, while here they are optional for older deployments. So once this ships it can use `Board`, `Daily`, `TechniqueExample` and `ValidateBoardData` directly.

**Not bugs (documented in JSDoc, closed)**

- **#2 `SolverHintStep.localization`.** The `{text?, title?}` type matches what clients receive. `sudojo_api` rewraps the solver's flat `LocalizedHint` for every `technique > 0` hint (`routes/solver.ts`, `routes/practices.ts`), and the solver emits no localization for `technique: 0` hints. The flat raw shape is noted on `SolverResult`.
- **#5 `ValidateBoardData.difficulty_score?`.** Optional is looser than the wire, but it is safe for readers. Making it required would break any consumer that builds the object. JSDoc says it is always sent.
- **#8 `SolverColor` has no `"unknown"`.** The wrapper maps all 10 `ESudokuColor` values, so its `"unknown"` default can't be reached.
- **#11 `getTechniqueNameById(AIC)` = `'AIC'`.** It is a display title and matches `sudojo_api`'s seeded `techniques.title` plus `sudojo_app/public/technique.aic.svg`. Changing it would break `getTechniqueIconUrl(48)`, and no consumer compares it to `step.title`. Tests pin both values.

**Open (owner action needed)**

- **#3 `SolverHintStep.areas` / `cells` can be `null`** in the autopencil hint (`technique: 0`), and the proxy passes that through. Only JSDoc is updated. Widening to `| null` breaks the typecheck at `sudojo_lib/src/utils/hintExplanation.ts:105,122,141` and `sudojo_bot/src/cards/hintCard.ts:81,115` (verified). Those spots are also latent runtime crashes if they are ever given that hint. Owner: guard them with `?? []`, then widen the type in a coordinated release.
- **#4b `sudojo_api/src/services/solver-proxy.ts:17-21`** types `code` as `string`. Owner: replace the local `SolverResponse<T>` with `SolverResult<T>` from this package. Consider forwarding the code too: `sudojo_lib/src/hooks/useBoardEntry.ts:106` classifies errors by message text.
- **#10b `/validate` accepts `brutalForce`, but `ValidateOptions` lacks it.** It was deliberately not added. `sudojo_client/src/network/sudojo-client.ts:1190-1192` forwards only `original`, and `brutalForce=false` currently fails for every puzzle (`sudojo_solver/docs/API.md:184`). Owner: fix the solver, then add `brutalForce?: boolean` here and forward it in `sudojo_client`. `sudojo_client/src/network/sudojo-client.ts:1142` still sends the dead `filters` param, which can be dropped. Remove the two deprecated fields at the next major.

## Gotchas

- **ESM-only.** `exports` has only `import` + `types` (no `require`/`default`), and `types` is listed after `import`.
- **Not types-only.** `dist/index.js` ships runtime code (enum, constants, utilities) and imports `SubscriptionPlatform` from `@sudobility/types` at runtime. Consumers must install that peer dependency.
- **Bitmask precision.** A single `2^n` is always exact as a double. Precision loss only happens in combined masks with an id ≥ 54: `addTechnique()`, JSON parsing, and `hasTechnique()` on an already-rounded input. Use the BigInt helpers and the `*_bitmask` strings (see gap #6). BigInt literals (`1n`) are fine: `tsconfig` targets ES2020.
- **`HINT_LEVEL_LIMITS` is deprecated.** Gate on `Level.entitlement` with `hasRequiredEntitlement()` instead. `sudojo_api` no longer returns 402 (gating is client-side), but `sudojo_client` and `sudojo_lib` still use `HintAccessDenied*`.
- **`solution` fields in `sudojo_api` GET responses are AES-256-GCM encrypted** when `SOLUTION_ENCRYPTION_KEY` is set (`sudojo_api/src/middleware/encryptSolutions.ts`). `sudojo_client` decrypts them. So `solution: string` on the wire may be ciphertext, not 81 digits.
- **`hasInvalidPencilmarksStep()` depends on the exact solver title** `"Invalid Pencilmarks"`.
- **Type tests are not typechecked by default.** `vitest run` does not check `expectTypeOf`, and `tsconfig.json` excludes `*.test.ts`. Running `tsc` over the test file shows 4 pre-existing errors in `GameSession`, `Technique{Create,Update}Request` and `BoardQueryParams` fixtures. There are a few solver `expectTypeOf` tests, but none for `Community` or `Strategy`.
- **`plans/IMPROVEMENTS.md` is partly stale.** It claims a 1920-line file, missing tests for the bitfield/UUID/cell/time helpers, missing entity JSDoc, and `Record<number, string>` titles. All of that is now done or covered.

## Consumers

`@sudobility/sudojo_types` versions as of 1.2.67:

| Repo | Dep kind | Range |
|---|---|---|
| `sudojo_api` | dependencies | `^1.2.67` |
| `sudojo_app`, `sudojo_app_rn`, `sudojo_bot`, `sudojo_extension` | dependencies | `^1.2.67` |
| `@sudobility/sudojo_client` | peer `^1.2.67`, **also** dev + dependencies `^1.2.61` | mixed |
| `@sudobility/sudojo_lib`, `@sudobility/sudojo_ui` | peer + dev | `^1.2.67` |
| `@sudobility/sudojo_ocr` | peer | `^1.2.67` |

`sudojo_solver` (C#) and `sudojo_ocr_ml` (Python) do not consume this package. Dependency: `@sudobility/types` (peer + dev `^1.9.67`) provides `Optional`, `BaseResponse`, pagination types and `SubscriptionPlatform`.

## Git Workflow

- Do not use feature branches for code changes. Always stay on the current branch.
