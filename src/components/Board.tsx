import React from 'react';
import Cell from './Cell';
import type { Stage } from '../utils/combined';

interface BoardProps {
  stage: Stage;
}

const Board: React.FC<BoardProps> = ({ stage }) => {
  const rowCount = stage.length;
  const colCount = stage[0]?.length || 12;

  return (
    <div className="relative group">
      {/* Outer glow effect */}
      <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
      
      {/* Board container */}
      <div className="relative glass rounded-2xl p-3 sm:p-4 bg-slate-900/90 shadow-2xl">
        {/* Grid */}
        <div
          className="grid gap-[1px] sm:gap-[2px] bg-slate-800/30 rounded-xl overflow-hidden"
          style={{
            gridTemplateRows: `repeat(${rowCount}, 1fr)`,
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            width: 'min(85vw, 280px, 35vh)',
            aspectRatio: `${colCount} / ${rowCount}`,
          }}
        >
          {stage.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell 
                key={`${rowIndex}-${colIndex}`} 
                type={cell[0]} 
              />
            ))
          )}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-[3px] border-l-[3px] border-cyan-400 rounded-tl-xl shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-[3px] border-r-[3px] border-cyan-400 rounded-tr-xl shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-[3px] border-l-[3px] border-cyan-400 rounded-bl-xl shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-[3px] border-r-[3px] border-cyan-400 rounded-br-xl shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
    </div>
  );
};

export default Board;
