import React from 'react';
import { TETROMINOS } from '../utils/combined';
import type { TetrominoKey } from '../utils/combined';

interface CellProps {
  type: string | number;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  const color = TETROMINOS[type as TetrominoKey]?.color || '0, 0, 0';
  
  return (
    <div
      style={{
        width: 'auto',
        background: `rgba(${color}, 0.8)`,
        border: type === 0 ? '0px solid' : '4px solid',
        borderBottomColor: `rgba(${color}, 0.1)`,
        borderRightColor: `rgba(${color}, 1)`,
        borderTopColor: `rgba(${color}, 1)`,
        borderLeftColor: `rgba(${color}, 0.3)`,
      }}
    />
  );
};

export default React.memo(Cell);
