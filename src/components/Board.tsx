import React from 'react';
import Cell from './Cell';
import type { Stage } from '../utils/combined';

interface BoardProps {
  stage: Stage;
}

const Board: React.FC<BoardProps> = ({ stage }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${stage.length}, calc(25vw / ${stage[0].length}))`,
        gridTemplateColumns: `repeat(${stage[0].length}, 1fr)`,
        gridGap: '1px',
        border: '2px solid #333',
        width: '100%',
        maxWidth: '25vw',
        background: '#111',
      }}
    >
      {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
    </div>
  );
};

export default Board;
