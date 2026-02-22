import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  successResponse,
  errorResponse,
  getBeltForLevel,
  getAllBelts,
  getBeltIconSvg,
  getBeltIconForLevel,
  BELT_COLORS,
  BELT_ICON_PATHS,
  BELT_ICON_VIEWBOX,
  // Board utilities
  BOARD_SIZE,
  BLOCK_SIZE,
  TOTAL_CELLS,
  parseBoardString,
  stringifyBoard,
  // Scramble utilities
  scrambleBoard,
  noScramble,
  DEFAULT_SCRAMBLE_CONFIG,
  // Solver utilities
  isBoardFilled,
  isBoardSolved,
  getMergedBoardState,
  hasInvalidPencilmarksStep,
  hasPencilmarkContent,
  getTechniqueNameById,
  TechniqueId,
  type ScrambleConfig,
  type ScrambleResult,
  type Belt,
  type Level,
  type Technique,
  type Learning,
  type Board,
  type Daily,
  type Challenge,
  type LevelCreateRequest,
  type LevelUpdateRequest,
  type TechniqueCreateRequest,
  type TechniqueUpdateRequest,
  type LearningCreateRequest,
  type LearningUpdateRequest,
  type BoardCreateRequest,
  type BoardUpdateRequest,
  type DailyCreateRequest,
  type DailyUpdateRequest,
  type ChallengeCreateRequest,
  type ChallengeUpdateRequest,
  type TechniqueQueryParams,
  type LearningQueryParams,
  type BoardQueryParams,
  type ChallengeQueryParams,
  type HealthCheckData,
  type BaseResponse,
  type Optional,
} from './index';

// =============================================================================
// Helper Function Tests
// =============================================================================

describe('successResponse', () => {
  it('should create a success response with data', () => {
    const data = { id: 1, name: 'test' };
    const response = successResponse(data);

    expect(response.success).toBe(true);
    expect(response.data).toEqual(data);
    expect(response.timestamp).toBeDefined();
    expect(typeof response.timestamp).toBe('string');
  });

  it('should create valid ISO timestamp', () => {
    const response = successResponse('test');
    const date = new Date(response.timestamp);

    expect(date.toString()).not.toBe('Invalid Date');
  });

  it('should work with different data types', () => {
    expect(successResponse(null).data).toBeNull();
    expect(successResponse(123).data).toBe(123);
    expect(successResponse([1, 2, 3]).data).toEqual([1, 2, 3]);
    expect(successResponse({ nested: { value: true } }).data).toEqual({
      nested: { value: true },
    });
  });
});

describe('errorResponse', () => {
  it('should create an error response with message', () => {
    const response = errorResponse('Something went wrong');

    expect(response.success).toBe(false);
    expect(response.error).toBe('Something went wrong');
    expect(response.timestamp).toBeDefined();
  });

  it('should create valid ISO timestamp', () => {
    const response = errorResponse('error');
    const date = new Date(response.timestamp);

    expect(date.toString()).not.toBe('Invalid Date');
  });
});

// =============================================================================
// Type Tests - Entity Types
// =============================================================================

describe('Entity Types', () => {
  it('Level type should have correct shape', () => {
    const level: Level = {
      level: 1,
      title: 'Beginner',
      text: 'Introduction to Sudoku',
      requires_subscription: false,
      created_at: new Date(),
      updated_at: null,
    };

    expectTypeOf(level.level).toBeNumber();
    expectTypeOf(level.title).toBeString();
    expectTypeOf(level.text).toEqualTypeOf<string | null>();
    expectTypeOf(level.requires_subscription).toEqualTypeOf<boolean | null>();
    expectTypeOf(level.created_at).toEqualTypeOf<Date | null>();
    expectTypeOf(level.updated_at).toEqualTypeOf<Date | null>();
  });

  it('Technique type should have correct shape', () => {
    const technique: Technique = {
      technique: 1,
      level: 1,
      title: 'Naked Singles',
      path: 'naked-singles',
      dependencies: null,
      text: null,
      created_at: null,
      updated_at: null,
    };

    expectTypeOf(technique.technique).toBeNumber();
    expectTypeOf(technique.level).toEqualTypeOf<number | null>();
    expectTypeOf(technique.title).toBeString();
    expectTypeOf(technique.path).toEqualTypeOf<string | null>();
    expectTypeOf(technique.dependencies).toEqualTypeOf<string | null>();
  });

  it('Learning type should have correct shape', () => {
    const learning: Learning = {
      uuid: '789',
      technique: 1,
      index: 0,
      language_code: 'en',
      text: 'Learn this technique',
      image_url: null,
      created_at: null,
      updated_at: null,
    };

    expectTypeOf(learning.technique).toEqualTypeOf<number | null>();
    expectTypeOf(learning.language_code).toBeString();
    expectTypeOf(learning.image_url).toEqualTypeOf<string | null>();
  });

  it('Board type should have correct shape', () => {
    const board: Board = {
      uuid: 'board-1',
      level: 1,
      symmetrical: true,
      board:
        '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      solution:
        '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
      techniques: 3,
      created_at: null,
      updated_at: null,
    };

    expectTypeOf(board.board).toBeString();
    expectTypeOf(board.solution).toBeString();
    expectTypeOf(board.level).toEqualTypeOf<number | null>();
    expectTypeOf(board.symmetrical).toEqualTypeOf<boolean | null>();
    expectTypeOf(board.techniques).toEqualTypeOf<number | null>();
  });

  it('Daily type should have correct shape', () => {
    const daily: Daily = {
      uuid: 'daily-1',
      date: '2024-01-15',
      board_uuid: 'board-1',
      level: 1,
      techniques: 2,
      board:
        '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      solution:
        '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
      created_at: null,
      updated_at: null,
    };

    expectTypeOf(daily.date).toBeString();
    expectTypeOf(daily.board_uuid).toEqualTypeOf<string | null>();
    expectTypeOf(daily.level).toEqualTypeOf<number | null>();
  });

  it('Challenge type should have correct shape', () => {
    const challenge: Challenge = {
      uuid: 'challenge-1',
      board_uuid: null,
      level: 1,
      difficulty: 5,
      board:
        '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      solution:
        '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
      created_at: null,
      updated_at: null,
    };

    expectTypeOf(challenge.level).toEqualTypeOf<number | null>();
    expectTypeOf(challenge.difficulty).toEqualTypeOf<number | null>();
  });
});

// =============================================================================
// Type Tests - Request Types with Optional<T>
// =============================================================================

describe('Request Types use Optional<T>', () => {
  it('LevelCreateRequest should use Optional for optional fields', () => {
    const request: LevelCreateRequest = {
      index: 1,
      title: 'Test',
      text: undefined,
      requires_subscription: undefined,
    };

    expectTypeOf(request.index).toBeNumber();
    expectTypeOf(request.title).toBeString();
    expectTypeOf(request.text).toEqualTypeOf<Optional<string>>();
    expectTypeOf(request.requires_subscription).toEqualTypeOf<
      Optional<boolean>
    >();
  });

  it('LevelUpdateRequest should use Optional for all fields', () => {
    const request: LevelUpdateRequest = {
      index: undefined,
      title: undefined,
      text: undefined,
      requires_subscription: undefined,
    };

    expectTypeOf(request.index).toEqualTypeOf<Optional<number>>();
    expectTypeOf(request.title).toEqualTypeOf<Optional<string>>();
  });

  it('TechniqueCreateRequest should use Optional for optional fields', () => {
    const request: TechniqueCreateRequest = {
      level_uuid: '123',
      index: 1,
      title: 'Test',
      text: undefined,
    };

    expectTypeOf(request.level_uuid).toBeString();
    expectTypeOf(request.text).toEqualTypeOf<Optional<string>>();
  });

  it('TechniqueUpdateRequest should use Optional for all fields', () => {
    const request: TechniqueUpdateRequest = {
      level_uuid: undefined,
      index: undefined,
      title: undefined,
      text: undefined,
    };

    expectTypeOf(request.level_uuid).toEqualTypeOf<Optional<string>>();
    expectTypeOf(request.index).toEqualTypeOf<Optional<number>>();
  });

  it('LearningCreateRequest should handle Optional with null union', () => {
    const request: LearningCreateRequest = {
      technique_uuid: '123',
      index: 1,
      language_code: undefined,
      text: undefined,
      image_url: null, // Can be null or undefined
    };

    expectTypeOf(request.image_url).toEqualTypeOf<Optional<string | null>>();
  });

  it('BoardCreateRequest should handle Optional with null union', () => {
    const request: BoardCreateRequest = {
      level_uuid: null,
      symmetrical: undefined,
      board: '...',
      solution: '...',
      techniques: undefined,
    };

    expectTypeOf(request.level_uuid).toEqualTypeOf<Optional<string | null>>();
    expectTypeOf(request.symmetrical).toEqualTypeOf<Optional<boolean>>();
  });

  it('DailyCreateRequest should use Optional correctly', () => {
    const request: DailyCreateRequest = {
      date: '2024-01-15',
      board_uuid: undefined,
      level_uuid: null,
      techniques: undefined,
      board: '...',
      solution: '...',
    };

    expectTypeOf(request.board_uuid).toEqualTypeOf<Optional<string | null>>();
    expectTypeOf(request.techniques).toEqualTypeOf<Optional<number>>();
  });

  it('ChallengeCreateRequest should use Optional correctly', () => {
    const request: ChallengeCreateRequest = {
      board_uuid: undefined,
      level_uuid: undefined,
      difficulty: 5,
      board: '...',
      solution: '...',
    };

    expectTypeOf(request.difficulty).toEqualTypeOf<Optional<number>>();
  });
});

// =============================================================================
// Type Tests - Query Parameter Types
// =============================================================================

describe('Query Parameter Types', () => {
  it('TechniqueQueryParams should use Optional', () => {
    const params: TechniqueQueryParams = {
      level_uuid: undefined,
    };

    expectTypeOf(params.level_uuid).toEqualTypeOf<Optional<string>>();
  });

  it('LearningQueryParams should use Optional', () => {
    const params: LearningQueryParams = {
      technique_uuid: '123',
      language_code: undefined,
    };

    expectTypeOf(params.technique_uuid).toEqualTypeOf<Optional<string>>();
    expectTypeOf(params.language_code).toEqualTypeOf<Optional<string>>();
  });

  it('BoardQueryParams should use Optional', () => {
    const params: BoardQueryParams = {
      level_uuid: undefined,
    };

    expectTypeOf(params.level_uuid).toEqualTypeOf<Optional<string>>();
  });

  it('ChallengeQueryParams should use Optional', () => {
    const params: ChallengeQueryParams = {
      level_uuid: undefined,
      difficulty: 'hard',
    };

    expectTypeOf(params.level_uuid).toEqualTypeOf<Optional<string>>();
    expectTypeOf(params.difficulty).toEqualTypeOf<Optional<string>>();
  });
});

// =============================================================================
// Type Tests - Response Types
// =============================================================================

describe('Response Types', () => {
  it('successResponse should return BaseResponse<T>', () => {
    const response = successResponse({ id: 1 });

    expectTypeOf(response).toEqualTypeOf<BaseResponse<{ id: number }>>();
  });

  it('errorResponse should return BaseResponse<never>', () => {
    const response = errorResponse('error');

    expectTypeOf(response).toEqualTypeOf<BaseResponse<never>>();
  });

  it('HealthCheckData should have correct shape', () => {
    const health: HealthCheckData = {
      name: 'sudojo-api',
      version: '1.0.0',
      status: 'healthy',
    };

    expectTypeOf(health.name).toBeString();
    expectTypeOf(health.version).toBeString();
    expectTypeOf(health.status).toBeString();
  });
});

// =============================================================================
// Belt System Tests
// =============================================================================

describe('Belt System', () => {
  describe('BELT_COLORS', () => {
    it('should have 12 belt colors for levels 1-12', () => {
      expect(Object.keys(BELT_COLORS)).toHaveLength(12);
    });

    it('should have correct belt names in order', () => {
      expect(BELT_COLORS[1].name).toBe('White');
      expect(BELT_COLORS[2].name).toBe('White (Yellow Stripe)');
      expect(BELT_COLORS[3].name).toBe('Yellow');
      expect(BELT_COLORS[4].name).toBe('Yellow (Orange Stripe)');
      expect(BELT_COLORS[5].name).toBe('Orange');
      expect(BELT_COLORS[6].name).toBe('Orange (Green Stripe)');
      expect(BELT_COLORS[7].name).toBe('Green');
      expect(BELT_COLORS[8].name).toBe('Blue');
      expect(BELT_COLORS[9].name).toBe('Purple');
      expect(BELT_COLORS[10].name).toBe('Brown');
      expect(BELT_COLORS[11].name).toBe('Red');
      expect(BELT_COLORS[12].name).toBe('Black');
    });

    it('should have valid hex color codes', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(BELT_COLORS).forEach((belt) => {
        expect(belt.hex).toMatch(hexColorRegex);
        if (belt.stripeHex) {
          expect(belt.stripeHex).toMatch(hexColorRegex);
        }
      });
    });

    it('should have stripe colors for striped belts', () => {
      expect(BELT_COLORS[2].stripeHex).toBe('#FFEB3B'); // Yellow stripe
      expect(BELT_COLORS[4].stripeHex).toBe('#FF9800'); // Orange stripe
      expect(BELT_COLORS[6].stripeHex).toBe('#4CAF50'); // Green stripe
    });
  });

  describe('getBeltForLevel', () => {
    it('should return correct belt for valid levels 1-12', () => {
      expect(getBeltForLevel(1)).toEqual({ name: 'White', hex: '#FFFFFF' });
      expect(getBeltForLevel(5)).toEqual({ name: 'Orange', hex: '#FF9800' });
      expect(getBeltForLevel(12)).toEqual({ name: 'Black', hex: '#212121' });
    });

    it('should return striped belts with stripeHex', () => {
      expect(getBeltForLevel(2)).toEqual({
        name: 'White (Yellow Stripe)',
        hex: '#FFFFFF',
        stripeHex: '#FFEB3B',
      });
    });

    it('should return null for invalid level indices', () => {
      expect(getBeltForLevel(0)).toBeNull();
      expect(getBeltForLevel(13)).toBeNull();
      expect(getBeltForLevel(-1)).toBeNull();
    });
  });

  describe('getAllBelts', () => {
    it('should return all 12 belts as an array', () => {
      const belts = getAllBelts();
      expect(belts).toHaveLength(12);
    });

    it('should return belts in order from White to Black', () => {
      const belts = getAllBelts();
      expect(belts[0].name).toBe('White');
      expect(belts[11].name).toBe('Black');
    });
  });

  describe('Belt type', () => {
    it('should have correct shape', () => {
      const belt: Belt = { name: 'White', hex: '#FFFFFF' };

      expectTypeOf(belt.name).toBeString();
      expectTypeOf(belt.hex).toBeString();
    });

    it('should support optional stripeHex', () => {
      const stripedBelt: Belt = {
        name: 'White (Yellow Stripe)',
        hex: '#FFFFFF',
        stripeHex: '#FFEB3B',
      };

      expectTypeOf(stripedBelt.stripeHex).toEqualTypeOf<string | undefined>();
    });
  });

  describe('BELT_ICON_PATHS', () => {
    it('should be an array of SVG path strings', () => {
      expect(Array.isArray(BELT_ICON_PATHS)).toBe(true);
      expect(BELT_ICON_PATHS.length).toBe(8);
      BELT_ICON_PATHS.forEach((path) => {
        expect(typeof path).toBe('string');
        expect(path).toContain('M');
      });
    });
  });

  describe('BELT_ICON_VIEWBOX', () => {
    it('should be the correct viewBox string', () => {
      expect(BELT_ICON_VIEWBOX).toBe('0 0 478.619 184.676');
    });
  });

  describe('getBeltIconSvg', () => {
    it('should return valid SVG string with fill color', () => {
      const svg = getBeltIconSvg('#FF0000');

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('fill="#FF0000"');
      expect(svg).toContain('viewBox="0 0 478.619 184.676"');
    });

    it('should use default size of 100x40', () => {
      const svg = getBeltIconSvg('#2196F3');

      expect(svg).toContain('width="100"');
      expect(svg).toContain('height="40"');
    });

    it('should allow custom dimensions', () => {
      const svg = getBeltIconSvg('#2196F3', 200, 80);

      expect(svg).toContain('width="200"');
      expect(svg).toContain('height="80"');
    });

    it('should use black stroke for non-black belts', () => {
      const svg = getBeltIconSvg('#2196F3');

      expect(svg).toContain('stroke="#000000"');
    });

    it('should auto-detect white stroke for black belt', () => {
      const svg = getBeltIconSvg('#212121');

      expect(svg).toContain('stroke="#FFFFFF"');
    });

    it('should allow custom stroke color override', () => {
      const svg = getBeltIconSvg('#2196F3', 100, 40, '#FF0000');

      expect(svg).toContain('stroke="#FF0000"');
    });
  });

  describe('getBeltIconForLevel', () => {
    it('should return SVG for valid level', () => {
      const svg = getBeltIconForLevel(5);

      expect(svg).not.toBeNull();
      expect(svg).toContain('fill="#FF9800"'); // Orange belt
      expect(svg).toContain('stroke="#000000"');
    });

    it('should return SVG with white stroke for black belt (level 12)', () => {
      const svg = getBeltIconForLevel(12);

      expect(svg).not.toBeNull();
      expect(svg).toContain('fill="#212121"');
      expect(svg).toContain('stroke="#FFFFFF"');
    });

    it('should return null for invalid level', () => {
      expect(getBeltIconForLevel(0)).toBeNull();
      expect(getBeltIconForLevel(13)).toBeNull();
    });

    it('should allow custom dimensions', () => {
      const svg = getBeltIconForLevel(1, 50, 20);

      expect(svg).toContain('width="50"');
      expect(svg).toContain('height="20"');
    });

    it('should include stripe for striped belts', () => {
      const svg = getBeltIconForLevel(2); // White belt with yellow stripe

      expect(svg).not.toBeNull();
      expect(svg).toContain('fill="#FFFFFF"'); // White base
      expect(svg).toContain('#FFEB3B'); // Yellow stripe color
      expect(svg).toContain('clipPath'); // Stripe uses clip path
    });
  });
});

// =============================================================================
// Board Utilities Tests
// =============================================================================

describe('Board Utilities', () => {
  const validPuzzle =
    '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
  const validSolution =
    '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

  describe('constants', () => {
    it('should have correct BOARD_SIZE', () => {
      expect(BOARD_SIZE).toBe(9);
    });

    it('should have correct BLOCK_SIZE', () => {
      expect(BLOCK_SIZE).toBe(3);
    });

    it('should have correct TOTAL_CELLS', () => {
      expect(TOTAL_CELLS).toBe(81);
    });
  });

  describe('parseBoardString', () => {
    it('should parse valid 81-character string', () => {
      const board = parseBoardString(validPuzzle);

      expect(board).toHaveLength(9);
      board.forEach((row) => {
        expect(row).toHaveLength(9);
      });
    });

    it('should correctly parse digit values', () => {
      const board = parseBoardString(validPuzzle);

      expect(board[0][0]).toBe(5);
      expect(board[0][1]).toBe(3);
      expect(board[0][2]).toBe(0);
    });

    it('should throw error for invalid length', () => {
      expect(() => parseBoardString('12345')).toThrow(
        'Invalid board string length'
      );
    });

    it('should throw error for invalid characters', () => {
      const invalidBoard = 'x'.repeat(81);
      expect(() => parseBoardString(invalidBoard)).toThrow(
        'Invalid character at position'
      );
    });

    it('should handle dots as empty cells', () => {
      const boardWithDots = '.'.repeat(81);
      const board = parseBoardString(boardWithDots);

      expect(board[0][0]).toBe(0);
    });
  });

  describe('stringifyBoard', () => {
    it('should convert 2D array back to string', () => {
      const board = parseBoardString(validPuzzle);
      const result = stringifyBoard(board);

      expect(result).toBe(validPuzzle);
    });

    it('should throw error for invalid board size', () => {
      const invalidBoard = [[1, 2, 3]];
      expect(() => stringifyBoard(invalidBoard)).toThrow('Invalid board rows');
    });
  });
});

// =============================================================================
// Scramble Utilities Tests
// =============================================================================

describe('Scramble Utilities', () => {
  const validPuzzle =
    '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
  const validSolution =
    '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

  describe('DEFAULT_SCRAMBLE_CONFIG', () => {
    it('should have all options enabled by default', () => {
      expect(DEFAULT_SCRAMBLE_CONFIG.scrambleRows).toBe(true);
      expect(DEFAULT_SCRAMBLE_CONFIG.scrambleColumns).toBe(true);
      expect(DEFAULT_SCRAMBLE_CONFIG.scrambleRowBlocks).toBe(true);
      expect(DEFAULT_SCRAMBLE_CONFIG.scrambleColumnBlocks).toBe(true);
      expect(DEFAULT_SCRAMBLE_CONFIG.scrambleDigits).toBe(true);
      expect(DEFAULT_SCRAMBLE_CONFIG.rotate).toBe(true);
      expect(DEFAULT_SCRAMBLE_CONFIG.mirror).toBe(true);
    });
  });

  describe('scrambleBoard', () => {
    it('should return scrambled puzzle and solution', () => {
      const result = scrambleBoard(validPuzzle, validSolution);

      expect(result.puzzle).toHaveLength(81);
      expect(result.solution).toHaveLength(81);
    });

    it('should return valid digit mapping', () => {
      const result = scrambleBoard(validPuzzle, validSolution);

      expect(result.digitMapping.size).toBe(9);
      expect(result.reverseDigitMapping.size).toBe(9);

      // All digits 1-9 should be mapped
      for (let i = 1; i <= 9; i++) {
        expect(result.digitMapping.has(i)).toBe(true);
      }
    });

    it('should preserve the number of clues', () => {
      const result = scrambleBoard(validPuzzle, validSolution);

      const originalClues = validPuzzle
        .split('')
        .filter((c) => c !== '0').length;
      const scrambledClues = result.puzzle
        .split('')
        .filter((c) => c !== '0').length;

      expect(scrambledClues).toBe(originalClues);
    });

    it('should maintain puzzle/solution correspondence', () => {
      const result = scrambleBoard(validPuzzle, validSolution);

      // Each non-zero cell in puzzle should match solution
      for (let i = 0; i < 81; i++) {
        const puzzleVal = result.puzzle[i];
        const solutionVal = result.solution[i];
        if (puzzleVal !== '0') {
          expect(puzzleVal).toBe(solutionVal);
        }
      }
    });

    it('should produce valid Sudoku solution', () => {
      const result = scrambleBoard(validPuzzle, validSolution);
      const board = parseBoardString(result.solution);

      // Check all rows contain 1-9
      for (let row = 0; row < 9; row++) {
        const rowSet = new Set(board[row]);
        expect(rowSet.size).toBe(9);
        for (let d = 1; d <= 9; d++) {
          expect(rowSet.has(d)).toBe(true);
        }
      }

      // Check all columns contain 1-9
      for (let col = 0; col < 9; col++) {
        const colSet = new Set<number>();
        for (let row = 0; row < 9; row++) {
          colSet.add(board[row][col]);
        }
        expect(colSet.size).toBe(9);
      }

      // Check all blocks contain 1-9
      for (let blockRow = 0; blockRow < 3; blockRow++) {
        for (let blockCol = 0; blockCol < 3; blockCol++) {
          const blockSet = new Set<number>();
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
              blockSet.add(board[blockRow * 3 + r][blockCol * 3 + c]);
            }
          }
          expect(blockSet.size).toBe(9);
        }
      }
    });

    it('should respect disabled scramble options', () => {
      const config: ScrambleConfig = {
        scrambleRows: false,
        scrambleColumns: false,
        scrambleRowBlocks: false,
        scrambleColumnBlocks: false,
        scrambleDigits: false,
        rotate: false,
        mirror: false,
      };

      const result = scrambleBoard(validPuzzle, validSolution, config);

      // With all scrambling disabled, output should match input
      expect(result.puzzle).toBe(validPuzzle);
      expect(result.solution).toBe(validSolution);
    });

    it('should produce different output with scrambling enabled', () => {
      // Run multiple times to statistically verify randomness
      let differentCount = 0;
      for (let i = 0; i < 10; i++) {
        const result = scrambleBoard(validPuzzle, validSolution);
        if (result.puzzle !== validPuzzle) {
          differentCount++;
        }
      }
      // Should be different at least once (very high probability)
      expect(differentCount).toBeGreaterThan(0);
    });
  });

  describe('noScramble', () => {
    it('should return unchanged puzzle and solution', () => {
      const result = noScramble(validPuzzle, validSolution);

      expect(result.puzzle).toBe(validPuzzle);
      expect(result.solution).toBe(validSolution);
    });

    it('should return identity digit mapping', () => {
      const result = noScramble(validPuzzle, validSolution);

      for (let i = 1; i <= 9; i++) {
        expect(result.digitMapping.get(i)).toBe(i);
        expect(result.reverseDigitMapping.get(i)).toBe(i);
      }
    });
  });

  describe('ScrambleConfig type', () => {
    it('should have correct shape', () => {
      const config: ScrambleConfig = {
        scrambleRows: true,
        scrambleColumns: false,
        scrambleRowBlocks: true,
        scrambleColumnBlocks: false,
        scrambleDigits: true,
        rotate: false,
        mirror: true,
      };

      expectTypeOf(config.scrambleRows).toBeBoolean();
      expectTypeOf(config.scrambleDigits).toBeBoolean();
      expectTypeOf(config.rotate).toBeBoolean();
    });
  });

  describe('ScrambleResult type', () => {
    it('should have correct shape', () => {
      const result: ScrambleResult = {
        puzzle: validPuzzle,
        solution: validSolution,
        digitMapping: new Map([[1, 2]]),
        reverseDigitMapping: new Map([[2, 1]]),
      };

      expectTypeOf(result.puzzle).toBeString();
      expectTypeOf(result.solution).toBeString();
      expectTypeOf(result.digitMapping).toEqualTypeOf<Map<number, number>>();
      expectTypeOf(result.reverseDigitMapping).toEqualTypeOf<
        Map<number, number>
      >();
    });
  });
});

// =============================================================================
// Solver Utilities Tests
// =============================================================================

describe('Solver Utilities', () => {
  const validPuzzle =
    '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
  const validSolution =
    '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
  const emptyUser = '0'.repeat(81);

  describe('isBoardFilled', () => {
    it('should return false for empty board', () => {
      expect(isBoardFilled(emptyUser, emptyUser)).toBe(false);
    });

    it('should return false for partial puzzle with no user input', () => {
      expect(isBoardFilled(validPuzzle, emptyUser)).toBe(false);
    });

    it('should return true when puzzle + user fills all cells', () => {
      // Create user input that fills in the zeros
      let userInput = '';
      for (let i = 0; i < 81; i++) {
        if (validPuzzle[i] === '0') {
          userInput += validSolution[i];
        } else {
          userInput += '0';
        }
      }
      expect(isBoardFilled(validPuzzle, userInput)).toBe(true);
    });

    it('should return true for fully filled solution', () => {
      expect(isBoardFilled(validSolution, emptyUser)).toBe(true);
    });

    it('should handle user input overriding original', () => {
      // User fills in everything
      expect(isBoardFilled(validPuzzle, validSolution)).toBe(true);
    });
  });

  describe('isBoardSolved', () => {
    it('should return false for empty board', () => {
      expect(isBoardSolved(emptyUser, emptyUser, validSolution)).toBe(false);
    });

    it('should return false for unfilled board', () => {
      expect(isBoardSolved(validPuzzle, emptyUser, validSolution)).toBe(false);
    });

    it('should return true when correctly solved', () => {
      let userInput = '';
      for (let i = 0; i < 81; i++) {
        if (validPuzzle[i] === '0') {
          userInput += validSolution[i];
        } else {
          userInput += '0';
        }
      }
      expect(isBoardSolved(validPuzzle, userInput, validSolution)).toBe(true);
    });

    it('should return false when filled but incorrect', () => {
      // Fill with wrong values
      const wrongSolution = '1'.repeat(81);
      expect(isBoardSolved(emptyUser, wrongSolution, validSolution)).toBe(false);
    });
  });

  describe('getMergedBoardState', () => {
    it('should return original when user has no input', () => {
      expect(getMergedBoardState(validPuzzle, emptyUser)).toBe(validPuzzle);
    });

    it('should override with user input when present', () => {
      const userInput = '100000000' + '0'.repeat(72);
      const result = getMergedBoardState(validPuzzle, userInput);
      expect(result[0]).toBe('1'); // User override
      expect(result[1]).toBe('3'); // Original preserved
    });

    it('should return complete solution when user fills all', () => {
      let userInput = '';
      for (let i = 0; i < 81; i++) {
        if (validPuzzle[i] === '0') {
          userInput += validSolution[i];
        } else {
          userInput += '0';
        }
      }
      expect(getMergedBoardState(validPuzzle, userInput)).toBe(validSolution);
    });
  });

  describe('hasInvalidPencilmarksStep', () => {
    it('should return false for undefined', () => {
      expect(hasInvalidPencilmarksStep(undefined)).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(hasInvalidPencilmarksStep([])).toBe(false);
    });

    it('should return false for steps without Invalid Pencilmarks', () => {
      const steps = [
        { title: 'Naked Single' },
        { title: 'Hidden Single' },
      ];
      expect(hasInvalidPencilmarksStep(steps)).toBe(false);
    });

    it('should return true when Invalid Pencilmarks is present', () => {
      const steps = [
        { title: 'Naked Single' },
        { title: 'Invalid Pencilmarks' },
      ];
      expect(hasInvalidPencilmarksStep(steps)).toBe(true);
    });

    it('should handle steps with missing title', () => {
      const steps = [{}, { title: 'Test' }];
      expect(hasInvalidPencilmarksStep(steps)).toBe(false);
    });
  });

  describe('hasPencilmarkContent', () => {
    it('should return false for empty string', () => {
      expect(hasPencilmarkContent('')).toBe(false);
    });

    it('should return false for only commas', () => {
      expect(hasPencilmarkContent(','.repeat(80))).toBe(false);
    });

    it('should return true for string with digits', () => {
      expect(hasPencilmarkContent('123,45,,9,,')).toBe(true);
    });

    it('should return true for single digit', () => {
      expect(hasPencilmarkContent('1' + ','.repeat(80))).toBe(true);
    });
  });

  describe('getTechniqueNameById', () => {
    it('should return correct name for known techniques', () => {
      expect(getTechniqueNameById(TechniqueId.FULL_HOUSE)).toBe('Full House');
      expect(getTechniqueNameById(TechniqueId.HIDDEN_SINGLE)).toBe('Hidden Single');
      expect(getTechniqueNameById(TechniqueId.NAKED_SINGLE)).toBe('Naked Single');
      expect(getTechniqueNameById(TechniqueId.XY_WING)).toBe('XY-Wing');
    });

    it('should return fallback for unknown technique', () => {
      expect(getTechniqueNameById(999)).toBe('Technique 999');
    });

    it('should handle all defined TechniqueId values', () => {
      // Verify each TechniqueId has a name
      Object.values(TechniqueId)
        .filter((v): v is number => typeof v === 'number')
        .forEach((id) => {
          const name = getTechniqueNameById(id);
          expect(name).not.toContain('Technique '); // Should have real name
        });
    });
  });
});
