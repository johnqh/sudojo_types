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

/** Response data for /solver/solve endpoint */
export interface SolveData {
  /** Current board state */
  board: SolverBoard;
  /** Hint steps (up to 3) */
  hints: SolverHintStep[];
}

/** Response data for /solver/validate endpoint */
export interface ValidateData {
  /** Board with solution */
  board: SolverBoard;
  /** Always null for validate */
  hints: null;
}

/** Response data for /solver/generate endpoint */
export interface GenerateData {
  /** Generated puzzle with solution */
  board: SolverBoard;
  /** Difficulty level (1-12) */
  level: number;
  /** Count of techniques required to solve */
  techniques: number;
  /** Always null for generate */
  hints: null;
}
