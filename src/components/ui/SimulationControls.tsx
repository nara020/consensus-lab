"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { ConsensusMode } from "@/types/consensus";
import { CONSENSUS_INFO } from "@/constants/consensusInfo";

// ==========================================
// PROPS
// ==========================================
interface SimulationControlsProps {
  mode: ConsensusMode;
  isPaused: boolean;
  speed: number;
  onTogglePause: () => void;
  onSpeedChange: (speed: number) => void;
  onSkip: () => void;
}

const SPEED_OPTIONS = [
  { value: 0.5, label: "0.5x" },
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
  { value: 3, label: "3x" },
];

// ==========================================
// COMPONENT
// ==========================================
function SimulationControlsComponent({
  mode,
  isPaused,
  speed,
  onTogglePause,
  onSpeedChange,
  onSkip,
}: SimulationControlsProps) {
  const info = CONSENSUS_INFO[mode];

  return (
    <motion.div
      className="absolute bottom-4 right-4 z-20 flex items-center gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Pause/Resume Button */}
      <motion.button
        onClick={onTogglePause}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: isPaused ? `${info.color}30` : "rgba(255,255,255,0.1)",
          border: `1px solid ${isPaused ? info.color : "rgba(255,255,255,0.2)"}`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPaused ? "Resume" : "Pause"}
      >
        {isPaused ? (
          <span className="text-lg" style={{ color: info.color }}>▶</span>
        ) : (
          <span className="text-lg text-white">⏸</span>
        )}
      </motion.button>

      {/* Speed Control */}
      <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1 border border-white/10">
        {SPEED_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onSpeedChange(option.value)}
            className="px-2 py-1 rounded-full text-[10px] font-mono transition-all"
            style={{
              background: speed === option.value ? `${info.color}40` : "transparent",
              color: speed === option.value ? info.color : "rgba(255,255,255,0.5)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>

      {/* Skip Button */}
      <motion.button
        onClick={onSkip}
        className="px-3 py-2 rounded-lg text-xs font-mono text-gray-400 hover:text-white transition-all bg-black/30 border border-white/10 hover:border-white/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Skip →
      </motion.button>
    </motion.div>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const SimulationControls = memo(SimulationControlsComponent);
