import React from 'react';
import { TETROMINOS } from '../utils/combined';
import type { TetrominoKey } from '../utils/combined';

interface CellProps {
  type: string | number;
}

// Enhanced color mapping for neon glow effects
const getCellStyles = (type: string | number): React.CSSProperties => {
  if (type === 0) {
    return {
      background: 'rgba(15, 23, 42, 0.6)',
      boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.4)',
    };
  }

  const color = TETROMINOS[type as TetrominoKey]?.color || '0, 0, 0';
  const [r, g, b] = color.split(',').map(n => parseInt(n.trim()));
  
  return {
    background: `linear-gradient(145deg, rgba(${r}, ${g}, ${b}, 1), rgba(${Math.max(0, r-30)}, ${Math.max(0, g-30)}, ${Math.max(0, b-30)}, 0.9))`,
    boxShadow: `
      inset -3px -3px 6px rgba(0, 0, 0, 0.4),
      inset 3px 3px 6px rgba(255, 255, 255, 0.25),
      0 0 12px rgba(${r}, ${g}, ${b}, 0.8),
      0 0 20px rgba(${r}, ${g}, ${b}, 0.4)
    `,
  };
};

const Cell: React.FC<CellProps> = ({ type }) => {
  const isFilled = type !== 0;
  const styles = getCellStyles(type);

  return (
    <div
      className={`
        relative aspect-square min-w-[10px] min-h-[10px] sm:min-w-[14px] sm:min-h-[14px]
        ${isFilled ? 'border-[2px] sm:border-[3px] rounded-[1px] sm:rounded-sm' : ''}
        transition-all duration-150 ease-out
        ${isFilled ? 'scale-100' : 'scale-95'}
      `}
      style={{
        ...styles,
        borderTopColor: isFilled ? 'rgba(255, 255, 255, 0.6)' : undefined,
        borderLeftColor: isFilled ? 'rgba(255, 255, 255, 0.4)' : undefined,
        borderRightColor: isFilled ? 'rgba(0, 0, 0, 0.4)' : undefined,
        borderBottomColor: isFilled ? 'rgba(0, 0, 0, 0.6)' : undefined,
      }}
    >
      {/* Inner highlight for 3D effect */}
      {isFilled && (
        <div 
          className="absolute inset-0 rounded-sm pointer-events-none overflow-hidden"
        >
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)',
            }}
          />
          {/* Shine effect */}
          <div 
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent transform rotate-45"
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(Cell);
