import React from 'react';

interface GameGridProps {
  grid: string[][];
  currentRow: number;
  evaluations: string[][];
}

const GameGrid: React.FC<GameGridProps> = ({ grid, currentRow, evaluations }) => {
  return (
    <div className="flex flex-col gap-2 p-4">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {row.map((cell, cellIndex) => {
            const evaluation = evaluations[rowIndex]?.[cellIndex];
            const isCurrentRow = rowIndex === currentRow;
            const isEmpty = cell === '';
            
            let tileClass = 'tile';
            
            if (!isEmpty) {
              tileClass += ' filled';
            }
            
            if (evaluation === 'correct') {
              tileClass += ' correct';
            } else if (evaluation === 'present') {
              tileClass += ' present';
            } else if (evaluation === 'absent') {
              tileClass += ' absent';
            }
            
            return (
              <div
                key={cellIndex}
                className={tileClass}
                style={{
                  animationDelay: evaluation ? `${cellIndex * 0.1}s` : '0s'
                }}
              >
                {cell.toUpperCase()}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameGrid;