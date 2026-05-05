import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  const linePoints = [40, 100, 300, 1200];

  const calcScore = useCallback(() => {
    // We have score
    if (rowsCleared > 0) {
      // This is how original Tetris score is calculated
      // Clamp to max 4 lines (index 3) to avoid undefined
      const index = Math.min(rowsCleared, 4) - 1;
      setScore(prev => prev + linePoints[index] * (level + 1));
      setRows(prev => prev + rowsCleared);
    }
  }, [level, linePoints, rowsCleared]);

  useEffect(() => {
    calcScore();
  }, [calcScore, rowsCleared]);

  return [score, setScore, rows, setRows, level, setLevel] as const;
};
