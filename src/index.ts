/**
 * @sudobility/sudojo-types
 * TypeScript types for Sudojo API - Sudoku learning platform
 */

// Re-export common types from @sudobility/types
export type {
  ApiResponse,
  BaseResponse,
  Optional,
  PaginatedResponse,
  PaginationInfo,
  PaginationOptions,
} from '@sudobility/types';

import type { Optional } from '@sudobility/types';

// =============================================================================
// Entity Types (database models)
// =============================================================================

export interface Level {
  uuid: string;
  index: number;
  title: string;
  text: string | null;
  requires_subscription: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Technique {
  uuid: string;
  level_uuid: string | null;
  index: number;
  title: string;
  text: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Learning {
  uuid: string;
  technique_uuid: string | null;
  index: number;
  language_code: string;
  text: string | null;
  image_url: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Board {
  uuid: string;
  level_uuid: string | null;
  symmetrical: boolean | null;
  board: string;
  solution: string;
  techniques: number | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Daily {
  uuid: string;
  date: string;
  board_uuid: string | null;
  level_uuid: string | null;
  techniques: number | null;
  board: string;
  solution: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Challenge {
  uuid: string;
  board_uuid: string | null;
  level_uuid: string | null;
  difficulty: number | null;
  board: string;
  solution: string;
  created_at: Date | null;
  updated_at: Date | null;
}

// =============================================================================
// Request Body Types
// =============================================================================

// Level requests
export interface LevelCreateRequest {
  index: number;
  title: string;
  text: Optional<string>;
  requires_subscription: Optional<boolean>;
}

export interface LevelUpdateRequest {
  index: Optional<number>;
  title: Optional<string>;
  text: Optional<string>;
  requires_subscription: Optional<boolean>;
}

// Technique requests
export interface TechniqueCreateRequest {
  level_uuid: string;
  index: number;
  title: string;
  text: Optional<string>;
}

export interface TechniqueUpdateRequest {
  level_uuid: Optional<string>;
  index: Optional<number>;
  title: Optional<string>;
  text: Optional<string>;
}

// Learning requests
export interface LearningCreateRequest {
  technique_uuid: string;
  index: number;
  language_code: Optional<string>;
  text: Optional<string>;
  image_url: Optional<string | null>;
}

export interface LearningUpdateRequest {
  technique_uuid: Optional<string>;
  index: Optional<number>;
  language_code: Optional<string>;
  text: Optional<string>;
  image_url: Optional<string | null>;
}

// Board requests
export interface BoardCreateRequest {
  level_uuid: Optional<string | null>;
  symmetrical: Optional<boolean>;
  board: string;
  solution: string;
  techniques: Optional<number>;
}

export interface BoardUpdateRequest {
  level_uuid: Optional<string | null>;
  symmetrical: Optional<boolean>;
  board: Optional<string>;
  solution: Optional<string>;
  techniques: Optional<number>;
}

// Daily requests
export interface DailyCreateRequest {
  date: string;
  board_uuid: Optional<string | null>;
  level_uuid: Optional<string | null>;
  techniques: Optional<number>;
  board: string;
  solution: string;
}

export interface DailyUpdateRequest {
  date: Optional<string>;
  board_uuid: Optional<string | null>;
  level_uuid: Optional<string | null>;
  techniques: Optional<number>;
  board: Optional<string>;
  solution: Optional<string>;
}

// Challenge requests
export interface ChallengeCreateRequest {
  board_uuid: Optional<string | null>;
  level_uuid: Optional<string | null>;
  difficulty: Optional<number>;
  board: string;
  solution: string;
}

export interface ChallengeUpdateRequest {
  board_uuid: Optional<string | null>;
  level_uuid: Optional<string | null>;
  difficulty: Optional<number>;
  board: Optional<string>;
  solution: Optional<string>;
}

// =============================================================================
// Query Parameter Types
// =============================================================================

export interface TechniqueQueryParams {
  level_uuid: Optional<string>;
}

export interface LearningQueryParams {
  technique_uuid: Optional<string>;
  language_code: Optional<string>;
}

export interface BoardQueryParams {
  level_uuid: Optional<string>;
}

export interface ChallengeQueryParams {
  level_uuid: Optional<string>;
  difficulty: Optional<string>;
}

// =============================================================================
// Response Helper Types
// =============================================================================

import type { BaseResponse } from '@sudobility/types';

/** Create a success response */
export function successResponse<T>(data: T): BaseResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/** Create an error response */
export function errorResponse(error: string): BaseResponse<never> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}

// =============================================================================
// Health check response
// =============================================================================

export interface HealthCheckData {
  name: string;
  version: string;
  status: string;
}

// =============================================================================
// Subscription Types (RevenueCat integration)
// =============================================================================

export interface RevenueCatEntitlement {
  expires_date: string | null;
  grace_period_expires_date: string | null;
  product_identifier: string;
  purchase_date: string;
}

export interface SubscriptionResult {
  hasSubscription: boolean;
  entitlement: RevenueCatEntitlement | null;
}

// =============================================================================
// Solver Types (Sudoku solving/validation/generation)
// =============================================================================

/** Pencilmark data for a Sudoku board */
export interface SolverPencilmarks {
  /** Whether pencilmarks were auto-generated */
  auto: boolean;
  /** Comma-delimited string of 81 pencilmark entries (e.g., "124,45,...") */
  pencilmarks: string;
}

/** Board state in solver responses */
export interface SolverBoard {
  /** Original puzzle (81-char string, 0 = empty) */
  original: string;
  /** User's current input (81-char string, 0 = empty) */
  user: string | null;
  /** Puzzle solution (81-char string) */
  solution: string | null;
  /** Pencilmark data */
  pencilmarks: SolverPencilmarks | null;
}

/** Area highlight type */
export type SolverAreaType = 'row' | 'column' | 'block';

/** Color for highlighting */
export type SolverColor =
  | 'none'
  | 'clear'
  | 'gray'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'white'
  | 'black';

/** Area to highlight in a hint */
export interface SolverHintArea {
  /** Type of area (row, column, or block) */
  type: SolverAreaType;
  /** Highlight color */
  color: SolverColor;
  /** Area index (0-8) */
  index: number;
}

/** Actions to perform on a cell */
export interface SolverCellActions {
  /** Digit to select as user input */
  select: string;
  /** Digit marked as wrong */
  unselect: string;
  /** Candidates to add as pencilmarks */
  add: string;
  /** Candidates to remove from pencilmarks */
  remove: string;
  /** Candidates to highlight */
  highlight: string;
}

/** Cell information in a hint */
export interface SolverHintCell {
  /** Row index (0-8) */
  row: number;
  /** Column index (0-8) */
  column: number;
  /** Highlight color */
  color: SolverColor;
  /** Whether to fill the cell background */
  fill: boolean;
  /** Actions to perform on this cell */
  actions: SolverCellActions;
}

/** A single hint step for solving */
export interface SolverHintStep {
  /** Name of the solving technique */
  title: string;
  /** Explanation of the technique */
  text: string;
  /** Areas to highlight */
  areas: SolverHintArea[];
  /** Cells involved in the hint */
  cells: SolverHintCell[];
}

/** Hints data from solver */
export interface SolverHints {
  /** Difficulty level */
  level: number;
  /** Count of techniques */
  techniques: number;
  /** Hint steps (up to 3) */
  steps: SolverHintStep[];
}

/** Board data wrapper from solver response */
export interface SolverBoardData {
  /** Difficulty level */
  level: number;
  /** Count of techniques */
  techniques: number;
  /** Board state */
  board: SolverBoard;
}

/** Response data for /solver/solve endpoint */
export interface SolveData {
  /** Current board state */
  board: SolverBoardData;
  /** Hints with steps */
  hints: SolverHints;
}

// =============================================================================
// Hint Access Control
// =============================================================================

/** User state for hint access control */
export type HintAccessUserState = 'anonymous' | 'no_subscription' | 'insufficient_tier';

/** Entitlement identifiers for hint access */
export type HintEntitlement = 'blue_belt' | 'red_belt';

/** Error details when hint access is denied (402 response) */
export interface HintAccessDeniedError {
  /** Error code for programmatic handling */
  code: 'HINT_ACCESS_DENIED';
  /** Human-readable error message */
  message: string;
  /** The difficulty level of the requested hint */
  hintLevel: number;
  /** The entitlement required to access this hint level */
  requiredEntitlement: HintEntitlement;
  /** The user's current state */
  userState: HintAccessUserState;
}

/** 402 response structure for hint access denied */
export interface HintAccessDeniedResponse {
  success: false;
  error: HintAccessDeniedError;
  timestamp: string;
}

/** Hint level limits by entitlement */
export const HINT_LEVEL_LIMITS = {
  red_belt: Infinity,
  blue_belt: 5,
  free: 3,
} as const;

/** Response data for /solver/validate endpoint */
export interface ValidateData {
  /** Board with solution (includes level/techniques metadata) */
  board: SolverBoardData;
  /** Always null for validate */
  hints: null;
}

/** Response data for /solver/generate endpoint */
export interface GenerateData {
  /** Generated puzzle with solution (includes level/techniques metadata) */
  board: SolverBoardData;
  /** Always null for generate */
  hints: null;
}

// =============================================================================
// Technique Bitfield (matches SudokuDefines.h enum SudokuTechnique)
// =============================================================================

/**
 * Technique IDs matching the solver engine's SudokuTechnique enum.
 * Used as bitfield values in boards.techniques and technique_examples.techniques_bitfield.
 */
export enum TechniqueId {
  FULL_HOUSE = 1,
  HIDDEN_SINGLE = 2,
  NAKED_SINGLE = 3,
  HIDDEN_PAIR = 4,
  NAKED_PAIR = 5,
  LOCKED_CANDIDATES = 6,
  HIDDEN_TRIPLE = 7,
  NAKED_TRIPLE = 8,
  HIDDEN_QUAD = 9,
  NAKED_QUAD = 10,
  X_WING = 11,
  SWORDFISH = 12,
  JELLYFISH = 13,
  XY_WING = 14,
  FINNED_X_WING = 15,
  SQUIRMBAG = 16,
  FINNED_SWORDFISH = 17,
  FINNED_JELLYFISH = 18,
  XYZ_WING = 19,
  WXYZ_WING = 20,
  ALMOST_LOCKED_SETS = 21,
  FINNED_SQUIRMBAG = 22,
  ALS_CHAIN = 23,
  // New techniques added to solver
  SKYSCRAPER = 24,
  TWO_STRING_KITE = 25,
  EMPTY_RECTANGLE = 26,
  SIMPLE_COLORING = 27,
  W_WING = 28,
  REMOTE_PAIRS = 29,
  UNIQUE_RECTANGLE_1 = 30,
  UNIQUE_RECTANGLE_2 = 31,
  BUG_PLUS_1 = 32,
  SUE_DE_COQ = 33,
  ALS_XZ = 34,
  X_CYCLES = 35,
  FORCING_CHAINS = 36,
  MEDUSA_COLORING = 37,
}

/** Map technique title strings (from solver API hints.steps[].title) to TechniqueId */
export const TECHNIQUE_TITLE_TO_ID: Record<string, TechniqueId> = {
  'Full House': TechniqueId.FULL_HOUSE,
  'Hidden Single': TechniqueId.HIDDEN_SINGLE,
  'Naked Single': TechniqueId.NAKED_SINGLE,
  'Hidden Pair': TechniqueId.HIDDEN_PAIR,
  'Naked Pair': TechniqueId.NAKED_PAIR,
  'Locked Candidates': TechniqueId.LOCKED_CANDIDATES,
  'Hidden Triple': TechniqueId.HIDDEN_TRIPLE,
  'Naked Triple': TechniqueId.NAKED_TRIPLE,
  'Hidden Quad': TechniqueId.HIDDEN_QUAD,
  'Naked Quad': TechniqueId.NAKED_QUAD,
  'X-Wing': TechniqueId.X_WING,
  'Swordfish': TechniqueId.SWORDFISH,
  'Jellyfish': TechniqueId.JELLYFISH,
  'XY-Wing': TechniqueId.XY_WING,
  'Finned X-Wing': TechniqueId.FINNED_X_WING,
  'Squirmbag': TechniqueId.SQUIRMBAG,
  'Finned Swordfish': TechniqueId.FINNED_SWORDFISH,
  'Finned Jellyfish': TechniqueId.FINNED_JELLYFISH,
  'XYZ-Wing': TechniqueId.XYZ_WING,
  'WXYZ-Wing': TechniqueId.WXYZ_WING,
  'Almost Locked Sets': TechniqueId.ALMOST_LOCKED_SETS,
  'Finned Squirmbag': TechniqueId.FINNED_SQUIRMBAG,
  'ALS Chain': TechniqueId.ALS_CHAIN,
  // New techniques added to solver
  'Skyscraper': TechniqueId.SKYSCRAPER,
  'Two-String Kite': TechniqueId.TWO_STRING_KITE,
  'Empty Rectangle': TechniqueId.EMPTY_RECTANGLE,
  'Simple Coloring': TechniqueId.SIMPLE_COLORING,
  'W-Wing': TechniqueId.W_WING,
  'Remote Pairs': TechniqueId.REMOTE_PAIRS,
  'Unique Rectangle Type 1': TechniqueId.UNIQUE_RECTANGLE_1,
  'Unique Rectangle Type 2': TechniqueId.UNIQUE_RECTANGLE_2,
  'BUG+1': TechniqueId.BUG_PLUS_1,
  'Sue de Coq': TechniqueId.SUE_DE_COQ,
  'ALS-XZ': TechniqueId.ALS_XZ,
  'X-Cycles': TechniqueId.X_CYCLES,
  'Forcing Chains': TechniqueId.FORCING_CHAINS,
  '3D Medusa': TechniqueId.MEDUSA_COLORING,
};

/** Convert a TechniqueId to its bit position in the bitfield */
export function techniqueToBit(techniqueId: TechniqueId): number {
  return 1 << (techniqueId - 1);
}

/** Check if a technique is present in a bitfield */
export function hasTechnique(bitfield: number, techniqueId: TechniqueId): boolean {
  return (bitfield & techniqueToBit(techniqueId)) !== 0;
}

/** Add a technique to a bitfield */
export function addTechnique(bitfield: number, techniqueId: TechniqueId): number {
  return bitfield | techniqueToBit(techniqueId);
}

// =============================================================================
// Technique Examples (for tutorials)
// =============================================================================

export interface TechniqueExample {
  uuid: string;
  /** Board state (81-char string, current position) */
  board: string;
  /** Pencilmarks at this state (comma-delimited) */
  pencilmarks: string | null;
  /** Solution for reference */
  solution: string;
  /** Bitfield of all techniques applicable at this board state */
  techniques_bitfield: number;
  /** Primary technique (the one solver would use first) */
  primary_technique: number;
  /** Hint data as JSON string */
  hint_data: string | null;
  /** Source board UUID for reference */
  source_board_uuid: string | null;
  created_at: Date | null;
}

export interface TechniqueExampleCreateRequest {
  board: string;
  pencilmarks: Optional<string>;
  solution: string;
  techniques_bitfield: number;
  primary_technique: number;
  hint_data: Optional<string>;
  source_board_uuid: Optional<string | null>;
}

export interface TechniqueExampleUpdateRequest {
  board: Optional<string>;
  pencilmarks: Optional<string>;
  solution: Optional<string>;
  techniques_bitfield: Optional<number>;
  primary_technique: Optional<number>;
  hint_data: Optional<string>;
  source_board_uuid: Optional<string | null>;
}

// =============================================================================
// Technique Practices (for practice mode)
// =============================================================================

export interface TechniquePractice {
  uuid: string;
  /** Reference to the technique this practice is for */
  technique_uuid: string | null;
  /** Board state (merged - looks like fresh puzzle) */
  board: string;
  /** Pencilmarks at this state (comma-delimited) */
  pencilmarks: string | null;
  /** Solution for reference */
  solution: string;
  /** Hint data as JSON string */
  hint_data: string | null;
  /** Source example UUID for reference */
  source_example_uuid: string | null;
  created_at: Date | null;
}

export interface TechniquePracticeCreateRequest {
  technique_uuid: string;
  board: string;
  pencilmarks: Optional<string>;
  solution: string;
  hint_data: Optional<string>;
  source_example_uuid: Optional<string | null>;
}

/** Practice count item for list endpoint */
export interface TechniquePracticeCountItem {
  technique_uuid: string;
  technique_title: string;
  count: number;
}

// =============================================================================
// Belt System (Karate belt progression for levels 1-9)
// =============================================================================

/** Belt information for a level */
export interface Belt {
  /** Belt name (e.g., "White", "Yellow") */
  name: string;
  /** Hex color code */
  hex: string;
}

/** Belt colors mapped to level index (1-9) */
export const BELT_COLORS: Record<number, Belt> = {
  1: { name: 'White', hex: '#FFFFFF' },
  2: { name: 'Yellow', hex: '#FFEB3B' },
  3: { name: 'Orange', hex: '#FF9800' },
  4: { name: 'Green', hex: '#4CAF50' },
  5: { name: 'Blue', hex: '#2196F3' },
  6: { name: 'Purple', hex: '#9C27B0' },
  7: { name: 'Brown', hex: '#795548' },
  8: { name: 'Red', hex: '#F44336' },
  9: { name: 'Black', hex: '#212121' },
};

/** Get the belt for a given level index (1-9) */
export function getBeltForLevel(levelIndex: number): Belt | null {
  return BELT_COLORS[levelIndex] ?? null;
}

/** Get all belts as an array ordered by level */
export function getAllBelts(): Belt[] {
  return Object.values(BELT_COLORS);
}

/**
 * SVG paths for the martial arts belt icon.
 * Based on Wikimedia Commons Judo belt design.
 * ViewBox: 0 0 478.619 184.676
 */
export const BELT_ICON_PATHS = [
  'M192.044,46.054c0,0-1.475,4.952,0.21,7.375c1.686,2.423,24.86,1.791,24.86,1.791L205.845,45L192.044,46.054z',
  'M9.831,23.198c0,0,119.181,32.087,233.779,32.087c114.598,0,214.679-51.187,218.5-53.479c3.819-2.292,12.987,38.963,0.765,48.131c-12.225,9.168-80.983,48.896-216.208,48.896c-135.226,0-233.015-21.392-239.892-29.032C-0.101,62.161-0.101,31.602,9.831,23.198z',
  'M252.014,126.336c0,0-22.156-6.112-28.268-21.392c-6.111-15.279,58.827-29.795,58.827-29.795l-6.112,31.324L252.014,126.336z',
  'M195.479,102.652c0,0,30.56,21.392,35.143,19.1c4.584-2.292,58.827-36.671,58.827-36.671L243.61,51.465l-50.423,38.2L195.479,102.652z',
  'M22.818,152.312c0,0,125.293-76.398,200.928-106.958c75.635-30.56,30.56,29.031,30.56,29.031s-78.69,38.199-110.778,57.299s-81.746,50.424-87.858,51.188C49.558,183.635,22.818,152.312,22.818,152.312z',
  'M255.967,27.303c0,0-5.29-1.851-14.146,8.46c-8.857,10.312,15.07,8.197,15.07,8.197L255.967,27.303z',
  'M232.15,28.546c0,0,94.734,49.659,127.586,60.355c32.851,10.696,113.832,46.603,116.889,55.771s-27.503,30.559-27.503,30.559s-23.685-21.391-54.243-34.379c-30.56-12.987-83.274-34.379-112.306-48.131c-29.031-13.751-89.387-47.367-89.387-47.367L232.15,28.546z',
  'M255.834,27.782c0,0-2.292,92.442-4.584,97.026c-2.293,4.584,42.783-12.987,43.546-18.335c0.765-5.349,6.877-50.423,2.293-55.007S260.417,25.49,255.834,27.782z',
];

/** Original viewBox for the belt icon */
export const BELT_ICON_VIEWBOX = '0 0 478.619 184.676';

/**
 * Generate a complete SVG string for the martial arts belt icon.
 * Uses black stroke for all colors except black belt, which uses white stroke.
 *
 * @param fill - Fill color for the belt
 * @param width - Width in pixels (default: 100)
 * @param height - Height in pixels (default: 40)
 * @param strokeColor - Stroke color (default: auto-detected based on fill)
 *
 * @example
 * // Get SVG for blue belt:
 * const svg = getBeltIconSvg('#2196F3');
 *
 * // Get SVG for black belt (auto white stroke):
 * const svg = getBeltIconSvg('#212121');
 *
 * // React with dangerouslySetInnerHTML:
 * <div dangerouslySetInnerHTML={{ __html: getBeltIconSvg(belt.hex) }} />
 */
export function getBeltIconSvg(
  fill: string,
  width: number = 100,
  height: number = 40,
  strokeColor?: string
): string {
  // Auto-detect stroke color: use white for dark fills (black belt)
  const stroke =
    strokeColor ??
    (fill.toLowerCase() === '#212121' || fill.toLowerCase() === '#000000'
      ? '#FFFFFF'
      : '#000000');

  const paths = BELT_ICON_PATHS.map(
    (d) => `<path fill="${fill}" stroke="${stroke}" stroke-width="4" d="${d}"/>`
  ).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BELT_ICON_VIEWBOX}" width="${width}" height="${height}">${paths}</svg>`;
}

/**
 * Generate belt icon SVG for a specific level index.
 * Convenience function that combines getBeltForLevel and getBeltIconSvg.
 *
 * @param levelIndex - Level index (1-9)
 * @param width - Width in pixels (default: 100)
 * @param height - Height in pixels (default: 40)
 * @returns SVG string or null if level is invalid
 */
export function getBeltIconForLevel(
  levelIndex: number,
  width: number = 100,
  height: number = 40
): string | null {
  const belt = getBeltForLevel(levelIndex);
  if (!belt) return null;
  return getBeltIconSvg(belt.hex, width, height);
}

// =============================================================================
// Board Utilities (for parsing and manipulating Sudoku boards)
// =============================================================================

/** Board size constant (9x9 grid) */
export const BOARD_SIZE = 9;

/** Block size constant (3x3 blocks) */
export const BLOCK_SIZE = 3;

/** Total cells in a board */
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

/**
 * Parses an 81-character board string into a 2D array of numbers
 * @param boardString - 81-character string where '0' or '.' represents empty cells
 * @returns 9x9 array of numbers (0 = empty, 1-9 = filled)
 */
export function parseBoardString(boardString: string): number[][] {
  if (boardString.length !== TOTAL_CELLS) {
    throw new Error(
      `Invalid board string length: expected ${TOTAL_CELLS}, got ${boardString.length}`
    );
  }

  const board: number[][] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowArray: number[] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      const index = row * BOARD_SIZE + col;
      const char = boardString[index];
      if (char === undefined) {
        throw new Error(`Missing character at position ${index}`);
      }
      const value = char === '.' ? 0 : parseInt(char, 10);
      if (isNaN(value) || value < 0 || value > 9) {
        throw new Error(`Invalid character at position ${index}: '${char}'`);
      }
      rowArray.push(value);
    }
    board.push(rowArray);
  }
  return board;
}

/**
 * Converts a 2D number array back to an 81-character string
 * @param board - 9x9 array of numbers
 * @returns 81-character string
 */
export function stringifyBoard(board: number[][]): string {
  if (board.length !== BOARD_SIZE) {
    throw new Error(
      `Invalid board rows: expected ${BOARD_SIZE}, got ${board.length}`
    );
  }

  let result = '';
  for (let row = 0; row < BOARD_SIZE; row++) {
    if (board[row]?.length !== BOARD_SIZE) {
      throw new Error(
        `Invalid row ${row} length: expected ${BOARD_SIZE}, got ${board[row]?.length}`
      );
    }
    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = board[row]?.[col];
      if (value === undefined || value < 0 || value > 9) {
        throw new Error(`Invalid value at (${row}, ${col}): ${value}`);
      }
      result += value.toString();
    }
  }
  return result;
}

// =============================================================================
// Scramble Utilities (for creating visually different but equivalent puzzles)
// =============================================================================

/**
 * Scramble configuration options
 */
export interface ScrambleConfig {
  /** Whether to scramble rows within blocks */
  scrambleRows: boolean;
  /** Whether to scramble columns within blocks */
  scrambleColumns: boolean;
  /** Whether to scramble row blocks (groups of 3 rows) */
  scrambleRowBlocks: boolean;
  /** Whether to scramble column blocks (groups of 3 columns) */
  scrambleColumnBlocks: boolean;
  /** Whether to scramble digit mapping (1-9 -> 1-9) */
  scrambleDigits: boolean;
  /** Whether to rotate the board (0, 90, 180, 270 degrees) */
  rotate: boolean;
  /** Whether to mirror the board */
  mirror: boolean;
}

/**
 * Default scramble configuration (all transformations enabled)
 */
export const DEFAULT_SCRAMBLE_CONFIG: ScrambleConfig = {
  scrambleRows: true,
  scrambleColumns: true,
  scrambleRowBlocks: true,
  scrambleColumnBlocks: true,
  scrambleDigits: true,
  rotate: true,
  mirror: true,
};

/**
 * Result of scrambling a board
 */
export interface ScrambleResult {
  /** The scrambled puzzle string */
  puzzle: string;
  /** The scrambled solution string */
  solution: string;
  /** The digit mapping used (original -> scrambled) */
  digitMapping: Map<number, number>;
  /** The reverse digit mapping (scrambled -> original) */
  reverseDigitMapping: Map<number, number>;
}

/**
 * Fisher-Yates shuffle algorithm for arrays
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j] as T;
    array[j] = temp as T;
  }
  return array;
}

/**
 * Creates a random digit mapping (1-9 -> 1-9)
 */
function createDigitMapping(): Map<number, number> {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffled = shuffleArray([...digits]);

  const mapping = new Map<number, number>();
  for (let i = 0; i < digits.length; i++) {
    mapping.set(digits[i] as number, shuffled[i] as number);
  }
  return mapping;
}

/**
 * Creates the reverse of a digit mapping
 */
function reverseDigitMapping(mapping: Map<number, number>): Map<number, number> {
  const reverse = new Map<number, number>();
  for (const [original, scrambled] of mapping) {
    reverse.set(scrambled, original);
  }
  return reverse;
}

/**
 * Applies digit mapping to a board
 */
function applyDigitMapping(
  board: number[][],
  mapping: Map<number, number>
): number[][] {
  return board.map((row) =>
    row.map((value) => {
      if (value === 0) return 0;
      return mapping.get(value) ?? value;
    })
  );
}

/**
 * Rotates the board 90 degrees clockwise
 */
function rotateBoard90(board: number[][]): number[][] {
  const rotated: number[][] = [];
  for (let col = 0; col < BOARD_SIZE; col++) {
    const newRow: number[] = [];
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      newRow.push(board[row]?.[col] ?? 0);
    }
    rotated.push(newRow);
  }
  return rotated;
}

/**
 * Mirrors the board horizontally (left-right)
 */
function mirrorHorizontally(board: number[][]): number[][] {
  return board.map((row) => [...row].reverse());
}

/**
 * Mirrors the board vertically (top-bottom)
 */
function mirrorVertically(board: number[][]): number[][] {
  return [...board].reverse().map((row) => [...row]);
}

/**
 * Scrambles a Sudoku board while preserving its logical structure.
 *
 * Scrambling preserves the logical structure of a Sudoku puzzle while making it
 * appear different. This is useful for:
 * - Preventing players from recognizing puzzles they've seen before
 * - Creating variety from a limited puzzle database
 * - Making it harder to look up solutions online
 *
 * @param puzzle - 81-character puzzle string
 * @param solution - 81-character solution string
 * @param config - Scramble configuration (defaults to all transformations enabled)
 * @returns Scramble result with scrambled puzzle, solution, and digit mapping
 *
 * @example
 * ```typescript
 * const result = scrambleBoard(puzzle, solution);
 * console.log(result.puzzle);      // Scrambled puzzle
 * console.log(result.solution);    // Scrambled solution
 * console.log(result.digitMapping); // Map from original to scrambled digits
 * ```
 */
export function scrambleBoard(
  puzzle: string,
  solution: string,
  config: ScrambleConfig = DEFAULT_SCRAMBLE_CONFIG
): ScrambleResult {
  // Parse the boards
  let puzzleBoard = parseBoardString(puzzle);
  let solutionBoard = parseBoardString(solution);

  // Create digit mapping (applied to both puzzle and solution)
  let digitMapping = new Map<number, number>();
  for (let i = 1; i <= 9; i++) {
    digitMapping.set(i, i); // Identity mapping by default
  }

  if (config.scrambleDigits) {
    digitMapping = createDigitMapping();
    puzzleBoard = applyDigitMapping(puzzleBoard, digitMapping);
    solutionBoard = applyDigitMapping(solutionBoard, digitMapping);
  }

  // Scramble rows within blocks
  if (config.scrambleRows) {
    const rowPermutations: number[][] = [];
    for (let blockRow = 0; blockRow < BLOCK_SIZE; blockRow++) {
      rowPermutations.push(shuffleArray([0, 1, 2]));
    }

    const applyRowPermutation = (board: number[][]): void => {
      for (let blockRow = 0; blockRow < BLOCK_SIZE; blockRow++) {
        const startRow = blockRow * BLOCK_SIZE;
        const perm = rowPermutations[blockRow] as number[];
        const rowsCopy = [
          [...(board[startRow] ?? [])],
          [...(board[startRow + 1] ?? [])],
          [...(board[startRow + 2] ?? [])],
        ];
        for (let i = 0; i < BLOCK_SIZE; i++) {
          board[startRow + i] = rowsCopy[perm[i] as number] as number[];
        }
      }
    };

    applyRowPermutation(puzzleBoard);
    applyRowPermutation(solutionBoard);
  }

  // Scramble columns within blocks
  if (config.scrambleColumns) {
    const colPermutations: number[][] = [];
    for (let blockCol = 0; blockCol < BLOCK_SIZE; blockCol++) {
      colPermutations.push(shuffleArray([0, 1, 2]));
    }

    const applyColPermutation = (board: number[][]): void => {
      for (let blockCol = 0; blockCol < BLOCK_SIZE; blockCol++) {
        const startCol = blockCol * BLOCK_SIZE;
        const perm = colPermutations[blockCol] as number[];
        for (let row = 0; row < BOARD_SIZE; row++) {
          const boardRow = board[row];
          if (boardRow) {
            const colsCopy = [
              boardRow[startCol],
              boardRow[startCol + 1],
              boardRow[startCol + 2],
            ];
            for (let i = 0; i < BLOCK_SIZE; i++) {
              boardRow[startCol + i] = colsCopy[perm[i] as number] as number;
            }
          }
        }
      }
    };

    applyColPermutation(puzzleBoard);
    applyColPermutation(solutionBoard);
  }

  // Scramble row blocks
  if (config.scrambleRowBlocks) {
    const blockOrder = shuffleArray([0, 1, 2]);

    const applyRowBlockPermutation = (board: number[][]): number[][] => {
      const allRows = board.map((row) => [...row]);
      const result: number[][] = [];
      for (let newBlockIndex = 0; newBlockIndex < BLOCK_SIZE; newBlockIndex++) {
        const oldBlockIndex = blockOrder[newBlockIndex] as number;
        for (let i = 0; i < BLOCK_SIZE; i++) {
          result.push(allRows[oldBlockIndex * BLOCK_SIZE + i] as number[]);
        }
      }
      return result;
    };

    puzzleBoard = applyRowBlockPermutation(puzzleBoard);
    solutionBoard = applyRowBlockPermutation(solutionBoard);
  }

  // Scramble column blocks
  if (config.scrambleColumnBlocks) {
    const blockOrder = shuffleArray([0, 1, 2]);

    const applyColBlockPermutation = (board: number[][]): number[][] => {
      const result: number[][] = board.map(() => new Array(BOARD_SIZE).fill(0));
      for (let newBlockIndex = 0; newBlockIndex < BLOCK_SIZE; newBlockIndex++) {
        const oldBlockIndex = blockOrder[newBlockIndex] as number;
        for (let i = 0; i < BLOCK_SIZE; i++) {
          const oldCol = oldBlockIndex * BLOCK_SIZE + i;
          const newCol = newBlockIndex * BLOCK_SIZE + i;
          for (let row = 0; row < BOARD_SIZE; row++) {
            const resultRow = result[row];
            if (resultRow) {
              resultRow[newCol] = board[row]?.[oldCol] ?? 0;
            }
          }
        }
      }
      return result;
    };

    puzzleBoard = applyColBlockPermutation(puzzleBoard);
    solutionBoard = applyColBlockPermutation(solutionBoard);
  }

  // Rotate
  if (config.rotate) {
    const rotations = Math.floor(Math.random() * 4);
    for (let i = 0; i < rotations; i++) {
      puzzleBoard = rotateBoard90(puzzleBoard);
      solutionBoard = rotateBoard90(solutionBoard);
    }
  }

  // Mirror
  if (config.mirror) {
    const mirrorType = Math.floor(Math.random() * 4);
    const applyMirror = (board: number[][]): number[][] => {
      switch (mirrorType) {
        case 1:
          return mirrorHorizontally(board);
        case 2:
          return mirrorVertically(board);
        case 3:
          return mirrorVertically(mirrorHorizontally(board));
        default:
          return board;
      }
    };
    puzzleBoard = applyMirror(puzzleBoard);
    solutionBoard = applyMirror(solutionBoard);
  }

  return {
    puzzle: stringifyBoard(puzzleBoard),
    solution: stringifyBoard(solutionBoard),
    digitMapping,
    reverseDigitMapping: reverseDigitMapping(digitMapping),
  };
}

/**
 * Creates an identity scramble result (no scrambling)
 * @param puzzle - 81-character puzzle string
 * @param solution - 81-character solution string
 * @returns ScrambleResult with identity mapping
 */
export function noScramble(puzzle: string, solution: string): ScrambleResult {
  const identityMapping = new Map<number, number>();
  for (let i = 1; i <= 9; i++) {
    identityMapping.set(i, i);
  }

  return {
    puzzle,
    solution,
    digitMapping: identityMapping,
    reverseDigitMapping: identityMapping,
  };
}
