"use client";

import { memo, useCallback } from "react";
import type { ConsensusMode } from "@/types/consensus";
import { CONSENSUS_INFO } from "@/constants/consensusInfo";

// ==========================================
// PROPS
// ==========================================
interface ModeSelectorProps {
  mode: ConsensusMode;
  onModeChange: (mode: ConsensusMode) => void;
  disabled: boolean;
}

// ==========================================
// CONSTANTS
// ==========================================
const MODES: ConsensusMode[] = ["pow", "pos", "raft", "qbft"];

// ==========================================
// COMPONENT
// ==========================================
function ModeSelectorComponent({
  mode,
  onModeChange,
  disabled,
}: ModeSelectorProps) {
  const handleClick = useCallback(
    (m: ConsensusMode) => {
      if (!disabled) {
        onModeChange(m);
      }
    },
    [disabled, onModeChange]
  );

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100]">
      <div className="flex gap-1 bg-black/90 backdrop-blur-md border border-gray-700 rounded-xl p-1.5">
        {MODES.map((m) => {
          const info = CONSENSUS_INFO[m];
          const isActive = mode === m;

          return (
            <button
              key={m}
              onClick={() => handleClick(m)}
              disabled={disabled}
              className={`px-4 py-2.5 rounded-lg font-mono text-xs transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50"
                  : "border border-transparent hover:bg-gray-800/50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ color: isActive ? info.color : "#9ca3af" }}
              aria-pressed={isActive}
              aria-label={`Select ${info.chain} consensus mechanism`}
            >
              <span className="text-lg block">{info.icon}</span>
              <span className="block mt-1 font-semibold">{info.chain}</span>
              <span className="block text-[10px] text-gray-500">
                {m === "qbft" ? "BFT" : info.name.split(" ").slice(-1)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const ModeSelector = memo(ModeSelectorComponent);
