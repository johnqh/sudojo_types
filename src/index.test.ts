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
      uuid: '123',
      index: 1,
      title: 'Beginner',
      text: 'Introduction to Sudoku',
      requires_subscription: false,
      created_at: new Date(),
      updated_at: null,
    };

    expectTypeOf(level.uuid).toBeString();
    expectTypeOf(level.index).toBeNumber();
    expectTypeOf(level.title).toBeString();
    expectTypeOf(level.text).toEqualTypeOf<string | null>();
    expectTypeOf(level.requires_subscription).toEqualTypeOf<boolean | null>();
    expectTypeOf(level.created_at).toEqualTypeOf<Date | null>();
    expectTypeOf(level.updated_at).toEqualTypeOf<Date | null>();
  });

  it('Technique type should have correct shape', () => {
    const technique: Technique = {
      uuid: '456',
      level_uuid: '123',
      index: 1,
      title: 'Naked Singles',
      text: null,
      created_at: null,
      updated_at: null,
    };

    expectTypeOf(technique.uuid).toBeString();
    expectTypeOf(technique.level_uuid).toEqualTypeOf<string | null>();
    expectTypeOf(technique.index).toBeNumber();
    expectTypeOf(technique.title).toBeString();
  });

  it('Learning type should have correct shape', () => {
    const learning: Learning = {
      uuid: '789',
      technique_uuid: '456',
      index: 0,
      language_code: 'en',
      text: 'Learn this technique',
      image_url: null,
      created_at: null,
      updated_at: null,
    };

    expectTypeOf(learning.language_code).toBeString();
    expectTypeOf(learning.image_url).toEqualTypeOf<string | null>();
  });

  it('Board type should have correct shape', () => {
    const board: Board = {
      uuid: 'board-1',
      level_uuid: '123',
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
    expectTypeOf(board.symmetrical).toEqualTypeOf<boolean | null>();
    expectTypeOf(board.techniques).toEqualTypeOf<number | null>();
  });

  it('Daily type should have correct shape', () => {
    const daily: Daily = {
      uuid: 'daily-1',
      date: '2024-01-15',
      board_uuid: 'board-1',
      level_uuid: '123',
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
  });

  it('Challenge type should have correct shape', () => {
    const challenge: Challenge = {
      uuid: 'challenge-1',
      board_uuid: null,
      level_uuid: '123',
      difficulty: 5,
      board:
        '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      solution:
        '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
      created_at: null,
      updated_at: null,
    };

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
    it('should have 9 belt colors for levels 1-9', () => {
      expect(Object.keys(BELT_COLORS)).toHaveLength(9);
    });

    it('should have correct belt names in order', () => {
      expect(BELT_COLORS[1].name).toBe('White');
      expect(BELT_COLORS[2].name).toBe('Yellow');
      expect(BELT_COLORS[3].name).toBe('Orange');
      expect(BELT_COLORS[4].name).toBe('Green');
      expect(BELT_COLORS[5].name).toBe('Blue');
      expect(BELT_COLORS[6].name).toBe('Purple');
      expect(BELT_COLORS[7].name).toBe('Brown');
      expect(BELT_COLORS[8].name).toBe('Red');
      expect(BELT_COLORS[9].name).toBe('Black');
    });

    it('should have valid hex color codes', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(BELT_COLORS).forEach((belt) => {
        expect(belt.hex).toMatch(hexColorRegex);
      });
    });
  });

  describe('getBeltForLevel', () => {
    it('should return correct belt for valid levels 1-9', () => {
      expect(getBeltForLevel(1)).toEqual({ name: 'White', hex: '#FFFFFF' });
      expect(getBeltForLevel(5)).toEqual({ name: 'Blue', hex: '#2196F3' });
      expect(getBeltForLevel(9)).toEqual({ name: 'Black', hex: '#212121' });
    });

    it('should return null for invalid level indices', () => {
      expect(getBeltForLevel(0)).toBeNull();
      expect(getBeltForLevel(10)).toBeNull();
      expect(getBeltForLevel(-1)).toBeNull();
    });
  });

  describe('getAllBelts', () => {
    it('should return all 9 belts as an array', () => {
      const belts = getAllBelts();
      expect(belts).toHaveLength(9);
    });

    it('should return belts in order from White to Black', () => {
      const belts = getAllBelts();
      expect(belts[0].name).toBe('White');
      expect(belts[8].name).toBe('Black');
    });
  });

  describe('Belt type', () => {
    it('should have correct shape', () => {
      const belt: Belt = { name: 'White', hex: '#FFFFFF' };

      expectTypeOf(belt.name).toBeString();
      expectTypeOf(belt.hex).toBeString();
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
      expect(svg).toContain('fill="#2196F3"'); // Blue belt
      expect(svg).toContain('stroke="#000000"');
    });

    it('should return SVG with white stroke for black belt (level 9)', () => {
      const svg = getBeltIconForLevel(9);

      expect(svg).not.toBeNull();
      expect(svg).toContain('fill="#212121"');
      expect(svg).toContain('stroke="#FFFFFF"');
    });

    it('should return null for invalid level', () => {
      expect(getBeltIconForLevel(0)).toBeNull();
      expect(getBeltIconForLevel(10)).toBeNull();
    });

    it('should allow custom dimensions', () => {
      const svg = getBeltIconForLevel(1, 50, 20);

      expect(svg).toContain('width="50"');
      expect(svg).toContain('height="20"');
    });
  });
});
