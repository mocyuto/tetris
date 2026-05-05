import React, { useState } from 'react';
import { createStage, checkCollision } from './utils/combined';

// Components
import Board from './components/Board';

// Custom Hooks
import { useInterval } from './hooks/useInterval';
import { usePlayer } from './hooks/usePlayer';
import { useBoard } from './hooks/useBoard';
import { useGameStatus } from './hooks/useGameStatus';

const SWIPE_THRESHOLD = 30; // スワイプ判定閾値（ピクセル）
const DOUBLE_TAP_DELAY = 300; // ダブルタップ判定時間（ミリ秒）

const App: React.FC = () => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate, setPlayerPos] = usePlayer();
  const [stage, setStage, rowsCleared] = useBoard(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  // タッチ操作用のstate
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [lastTapTime, setLastTapTime] = useState<number>(0);

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

  // ハードドロップ処理
  const hardDrop = () => {
    if (!gameOver) {
      let dropDistance = 0;
      while (!checkCollision(player, stage, { x: 0, y: dropDistance + 1 })) {
        dropDistance++;
      }
      setPlayerPos({ x: player.pos.x, y: player.pos.y + dropDistance, collided: true });
    }
  };

  // タッチイベントハンドラ
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    
    // ダブルタップ判定
    const currentTime = new Date().getTime();
    if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
      hardDrop();
      setLastTapTime(0); // リセット
    } else {
      setLastTapTime(currentTime);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // スワイプ判定
    if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
      // 水平方向のスワイプ
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          movePlayer(1); // 右
        } else {
          movePlayer(-1); // 左
        }
      } else {
        // 垂直方向のスワイプ
        if (deltaY > 0) {
          dropPlayer(); // 下（ソフトドロップ）
        } else {
          playerRotate(stage, 1); // 上（回転）
        }
      }
      
      // スワイプ後、新しい開始位置を設定（連続操作可能に）
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-hidden outline-none touch-none select-none"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        e.preventDefault();
        move(e);
      }}
      onKeyUp={keyUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-3 lg:gap-10 p-2 sm:p-4 lg:p-10 max-w-7xl mx-auto min-h-screen lg:min-h-screen">
        {/* Mobile Title - 一番上に表示 */}
        <div className="lg:hidden text-center order-1">
          <h1 className="text-3xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TETRIS
            </span>
          </h1>
          <p className="text-gray-500 text-xs mt-1 tracking-widest uppercase">Neon Edition</p>
        </div>

        {/* Game Board Section */}
        <div className="flex flex-col items-center gap-4 order-2 lg:order-none">
          <div className="animate-float" style={{ animationDelay: '0.5s' }}>
            <Board stage={stage} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full max-w-[280px] lg:w-72 flex flex-col gap-2 sm:gap-4 order-3 lg:order-none">
          {/* Game Over Display */}
          {gameOver ? (
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center animate-pulse-glow border-red-500/50 border-2 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <h2 className="text-xl sm:text-3xl font-bold text-red-500 animate-neon-flicker uppercase tracking-wider">
                Game Over
              </h2>
              <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm">Final Score: {score.toLocaleString()}</p>
            </div>
          ) : (
            <>
              {/* Score Card */}
              <div className="glass rounded-lg sm:rounded-2xl p-2 sm:p-5 flex items-center justify-between group hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shadow-lg">
                    <span className="text-base sm:text-xl">🏆</span>
                  </div>
                  <span className="text-gray-400 text-xs sm:text-sm font-medium">Score</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-white tabular-nums">{score.toLocaleString()}</span>
              </div>

              {/* Rows Card */}
              <div className="glass rounded-lg sm:rounded-2xl p-2 sm:p-5 flex items-center justify-between group hover:border-green-500/30 transition-all duration-300 hover:bg-white/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center shadow-lg">
                    <span className="text-base sm:text-xl">📊</span>
                  </div>
                  <span className="text-gray-400 text-xs sm:text-sm font-medium">Rows</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-white tabular-nums">{rows}</span>
              </div>

              {/* Level Card */}
              <div className="glass rounded-lg sm:rounded-2xl p-2 sm:p-5 flex items-center justify-between group hover:border-purple-500/30 transition-all duration-300 hover:bg-white/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shadow-lg">
                    <span className="text-base sm:text-xl">⭐</span>
                  </div>
                  <span className="text-gray-400 text-xs sm:text-sm font-medium">Level</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-white tabular-nums">{level}</span>
              </div>
            </>
          )}

          {/* Start Button */}
          <button
            onClick={startGame}
            className="relative group mt-1 sm:mt-2 w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:blur-lg" />
            <div className="relative glass bg-slate-900/90 rounded-lg sm:rounded-2xl px-4 sm:px-8 py-2 sm:py-5 flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98]">
              <span className="text-lg sm:text-2xl group-hover:rotate-12 transition-transform duration-300">
                {gameOver ? '🔄' : '▶️'}
              </span>
              <span className="text-sm sm:text-lg font-semibold text-white">
                {gameOver ? 'Play Again' : 'Start Game'}
              </span>
            </div>
          </button>

          {/* Controls Info */}
          <div className="glass rounded-lg sm:rounded-2xl p-2 sm:p-5 mt-1 sm:mt-2">
            <h3 className="text-gray-300 font-semibold mb-2 flex items-center gap-2 text-xs sm:text-base">
              <span className="text-cyan-400">⌨️</span> Controls
            </h3>
            {/* Desktop controls - hidden on mobile */}
            <div className="hidden sm:grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 rounded text-gray-300 font-mono border border-slate-700 text-xs">←</kbd>
                <span>Left</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 rounded text-gray-300 font-mono border border-slate-700 text-xs">→</kbd>
                <span>Right</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 rounded text-gray-300 font-mono border border-slate-700 text-xs">↓</kbd>
                <span>Down</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 rounded text-gray-300 font-mono border border-slate-700 text-xs">↑</kbd>
                <span>Rotate</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <kbd className="px-2 py-1 bg-slate-800 rounded text-gray-300 font-mono border border-slate-700 text-xs">Space</kbd>
                <span>Hard Drop</span>
              </div>
            </div>
            {/* Mobile controls - shown only on mobile */}
            <div className="sm:hidden grid grid-cols-2 gap-1 text-[10px] text-gray-400">
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">👈</span>
                <span>Swipe ←</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">👉</span>
                <span>Swipe →</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">👇</span>
                <span>Swipe ↓</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">👆</span>
                <span>Swipe ↑</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <span className="text-cyan-400">👆👆</span>
                <span>Double Tap = Hard Drop</span>
              </div>
            </div>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block text-center mt-2">
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                TETRIS
              </span>
            </h1>
            <p className="text-gray-500 text-xs mt-2 tracking-widest uppercase">Neon Edition</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
