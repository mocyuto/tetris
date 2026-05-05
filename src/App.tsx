import React, { useState } from 'react';
import { createStage, checkCollision } from './utils/combined';

// Components
import Board from './components/Board';

// Custom Hooks
import { useInterval } from './hooks/useInterval';
import { usePlayer } from './hooks/usePlayer';
import { useBoard } from './hooks/useBoard';
import { useGameStatus } from './hooks/useGameStatus';

// Styles
import './App.css';

const App: React.FC = () => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate, setPlayerPos] = usePlayer();
  const [stage, setStage, rowsCleared] = useBoard(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    // Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
  };

  const drop = () => {
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      // Also increase speed
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game Over
      if (player.pos.y < 1) {
        console.log('GAME OVER!!!');
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const move = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      } else if (keyCode === 32) {
        // Hard drop - checkCollisionが正しく計算した距離をそのまま使用
        let dropDistance = 0;
        while (!checkCollision(player, stage, { x: 0, y: dropDistance + 1 })) {
          dropDistance++;
        }
        setPlayerPos({ x: player.pos.x, y: player.pos.y + dropDistance, collided: true });
      }
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <div
      className="tetris-wrapper"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        e.preventDefault();
        move(e);
      }}
      onKeyUp={keyUp}
    >
      <div className="tetris">
        <Board stage={stage} />
        <aside>
          {gameOver ? (
            <div className="display gameover">Game Over</div>
          ) : (
            <div>
              <div className="display">Score: {score}</div>
              <div className="display">Rows: {rows}</div>
              <div className="display">Level: {level}</div>
            </div>
          )}
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </aside>
      </div>
    </div>
  );
};

export default App;
