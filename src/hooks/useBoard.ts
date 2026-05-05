import { useState, useEffect } from 'react';
import { createStage } from '../utils/combined';
import type { Stage } from '../utils/combined';

export const useBoard = (player: any, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = (newStage: Stage): Stage =>
      newStage.reduce((ack, row) => {
        if (row.every(cell => cell[0] !== 0)) {
          setRowsCleared(prev => prev + 1);
          ack.unshift(new Array(newStage[0].length).fill([0, 'clear']) as any);
          return ack;
        }
        ack.push(row);
        return ack;
      }, [] as Stage);

    const updateStage = (prevStage: Stage): Stage => {
      // First flush the stage
      const newStage = prevStage.map(row =>
        row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
      ) as Stage;

      // Then draw the tetromino
      player.tetromino.forEach((row: any, y: any) => {
        row.forEach((value: any, x: any) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? 'merged' : 'clear'}`,
            ];
          }
        });
      });

      // Then check if we collided
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }

      return newStage;
    };

    setStage(prev => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared] as const;
};
