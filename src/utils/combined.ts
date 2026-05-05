export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export type CellValue = string | number;
export type StageRow = [CellValue, string][];
export type Stage = StageRow[];

export const createStage = (): any =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  );

export const checkCollision = (
  player: any,
  stage: any,
  { x: moveX, y: moveY }: { x: number; y: number }
): boolean => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      if (player.tetromino[y][x] !== 0) {
        const newY = y + player.pos.y + moveY;
        const newX = x + player.pos.x + moveX;

        // ステージの範囲外チェック
        if (newY < 0 || newY >= STAGE_HEIGHT || newX < 0 || newX >= STAGE_WIDTH) {
          return true;
        }

        // 他のブロックとの衝突チェック
        if (stage[newY][newX][1] !== 'clear') {
          return true;
        }
      }
    }
  }
  return false;
};

export const TETROMINOS = {
  0: { shape: [[0]], color: '0, 0, 0' },
  I: {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
    ],
    color: '80, 227, 230',
  },
  J: {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0],
    ],
    color: '36, 95, 223',
  },
  L: {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L'],
    ],
    color: '223, 173, 36',
  },
  O: {
    shape: [
      ['O', 'O'],
      ['O', 'O'],
    ],
    color: '223, 217, 36',
  },
  S: {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0],
    ],
    color: '48, 211, 56',
  },
  T: {
    shape: [
      [0, 0, 0],
      ['T', 'T', 'T'],
      [0, 'T', 0],
    ],
    color: '132, 61, 198',
  },
  Z: {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0],
    ],
    color: '227, 78, 78',
  },
} as const;

export type TetrominoKey = keyof typeof TETROMINOS;

export const randomTetromino = (): any => {
  const tetrominos = 'IJLOSTZ' as const;
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)] as TetrominoKey;
  return TETROMINOS[randTetromino];
};
