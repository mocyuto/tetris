import { describe, it, expect } from 'vitest';
import { createStage, STAGE_HEIGHT, STAGE_WIDTH, checkCollision } from './combined';

describe('Game Utilities (combined.ts)', () => {
  it('should create a stage with correct dimensions', () => {
    const stage = createStage();
    expect(stage.length).toBe(STAGE_HEIGHT);
    expect(stage[0].length).toBe(STAGE_WIDTH);
  });

  it('should initialize stage cells with [0, "clear"]', () => {
    const stage = createStage();
    expect(stage[0][0]).toEqual([0, 'clear']);
  });

  describe('checkCollision', () => {
    const stage = createStage();
    const player = {
      pos: { x: 0, y: 0 },
      tetromino: [
        ['I', 'I', 'I', 'I'],
      ],
      collided: false,
    };

    it('should NOT detect collision when piece is within bounds and space is empty', () => {
      const collision = checkCollision(player, stage, { x: 0, y: 0 });
      expect(collision).toBe(false);
    });

    it('should detect collision with the left wall', () => {
      const collision = checkCollision(player, stage, { x: -1, y: 0 });
      expect(collision).toBe(true);
    });

    it('should detect collision with the right wall', () => {
      // Piece width is 4. STAGE_WIDTH is 12.
      // Pos x=0, move x=9 -> x goes from 9 to 12. stage[9][12] is out of bounds.
      const collision = checkCollision(player, stage, { x: 9, y: 0 });
      expect(collision).toBe(true);
    });

    it('should detect collision with the bottom', () => {
      const collision = checkCollision(player, stage, { x: 0, y: STAGE_HEIGHT });
      expect(collision).toBe(true);
    });
  });
});
