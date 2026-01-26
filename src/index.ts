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
