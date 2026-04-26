import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { useRef } from "react";

export function Overlay() {
  const { score, isGameOver, gameStarted, startGame, restartGame, setInput } =
    useStore();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX < window.innerWidth / 2) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    } else {
      setInput("shooting", true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const threshold = 20;

    setInput("left", dx < -threshold);
    setInput("right", dx > threshold);
    setInput("forward", dy < -threshold);
    setInput("backward", dy > threshold);
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setInput("left", false);
    setInput("right", false);
    setInput("forward", false);
    setInput("backward", false);
    setInput("shooting", false);
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none font-toy"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* HUD */}
      {gameStarted && !isGameOver && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8 flex flex-col gap-1"
        >
          <div className="glass-panel p-4 rounded-3xl min-w-[160px] chunky-shadow">
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest block mb-1">
              Score
            </span>
            <span className="text-white text-5xl font-black tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Control Help (Bottom Bar) */}
      {gameStarted && !isGameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-0 w-full flex justify-center"
        >
          <div className="glass-panel px-8 py-4 rounded-full flex gap-12 opacity-80 chunky-shadow">
            <div className="flex items-center gap-3">
              <kbd className="bg-white text-azure-deep px-3 py-1 rounded-lg font-black text-xs">
                WASD
              </kbd>
              <span className="text-white text-xs font-bold uppercase tracking-widest">
                Move Ship
              </span>
            </div>
            <div className="flex items-center gap-3 border-l-2 border-white/20 pl-12">
              <kbd className="bg-white text-azure-deep px-5 py-1 rounded-lg font-black text-xs">
                SPACE
              </kbd>
              <span className="text-white text-xs font-bold uppercase tracking-widest">
                Fire Cannons
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Start Screen */}
      <AnimatePresence>
        {!gameStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-auto flex flex-col items-center justify-center bg-azure-deep/40 backdrop-blur-md"
          >
            <div className="bg-white p-12 rounded-[3rem] chunky-shadow flex flex-col items-center gap-8 text-center max-w-sm border-b-8 border-gray-100">
              <div className="bg-azure-deep p-6 rounded-full shadow-inner">
                <div className="text-white text-6xl font-black rotate-[-10deg]">
                  🚀
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-azure-deep leading-tight">
                  TOY BOX
                  <br />
                  EXPLORER
                </h1>
                <p className="text-gray-400 mt-4 font-semibold uppercase text-sm tracking-tight">
                  Master the skies with heavy ordnance
                </p>
              </div>
              <button
                onClick={startGame}
                className="w-full bg-coral hover:brightness-110 active:scale-95 transition-all text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 text-xl shadow-lg"
              >
                <Play fill="currentColor" size={28} /> START MISSION
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Screen */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 pointer-events-auto flex items-center justify-center bg-azure-deep/60 backdrop-blur-md"
          >
            <div className="bg-white p-12 rounded-[3.5rem] chunky-shadow flex flex-col items-center gap-8 text-center max-w-md border-b-8 border-gray-100">
              <div className="bg-coral/10 p-8 rounded-full">
                <Trophy className="w-16 h-16 text-gold" strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-5xl font-black text-azure-deep">
                  CRASHED!
                </h2>
                <div className="mt-6 flex flex-col items-center glass-panel bg-azure-deep/5 border-azure-deep/10 p-6 rounded-3xl">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Total Points Earned
                  </span>
                  <span className="text-6xl font-black text-coral tabular-nums">
                    {score}
                  </span>
                </div>
              </div>
              <button
                onClick={restartGame}
                className="w-full bg-azure-deep hover:brightness-110 active:scale-95 transition-all text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 text-xl shadow-xl"
              >
                <RotateCcw className="w-6 h-6" strokeWidth={3} /> REBOOT SHIP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
