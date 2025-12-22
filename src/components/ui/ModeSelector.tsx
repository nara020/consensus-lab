"use client";

import { memo, useCallback, useState } from "react";
import type { ConsensusMode, ConsensusCategory } from "@/types/consensus";
import { CONSENSUS_INFO, MODE_CATEGORIES, CATEGORY_INFO } from "@/constants/consensusInfo";

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
const CATEGORIES: ConsensusCategory[] = ["layer1", "layer2", "alternative"];

const MODES_BY_CATEGORY: Record<ConsensusCategory, ConsensusMode[]> = {
  layer1: ["pow", "pos", "raft", "qbft"],
  layer2: ["optimistic", "zk"],
  alternative: ["ripple"],
};

// ==========================================
// COMPONENT
// ==========================================
function ModeSelectorComponent({
  mode,
  onModeChange,
  disabled,
}: ModeSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<ConsensusCategory>(
    MODE_CATEGORIES[mode]
  );

  const handleCategoryClick = useCallback((category: ConsensusCategory) => {
    setActiveCategory(category);
  }, []);

  const handleModeClick = useCallback(
    (m: ConsensusMode) => {
      if (!disabled) {
        onModeChange(m);
        setActiveCategory(MODE_CATEGORIES[m]);
      }
    },
    [disabled, onModeChange]
  );

  const currentModes = MODES_BY_CATEGORY[activeCategory];

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100]">
      {/* Category Tabs */}
      <div className="flex justify-center gap-1 mb-2">
        {CATEGORIES.map((category) => {
          const categoryInfo = CATEGORY_INFO[category];
          const isActive = activeCategory === category;
          const hasActiveMode = MODES_BY_CATEGORY[category].includes(mode);

          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                isActive
                  ? "bg-white/10 border border-white/30"
                  : "border border-transparent hover:bg-white/5"
              }`}
              style={{
                color: hasActiveMode ? categoryInfo.color : isActive ? categoryInfo.color : "#6b7280",
              }}
            >
              {categoryInfo.name}
              {hasActiveMode && !isActive && " •"}
            </button>
          );
        })}
      </div>

      {/* Mode Buttons */}
      <div className="flex gap-1 bg-black/90 backdrop-blur-md border border-gray-700 rounded-xl p-1.5">
        {currentModes.map((m) => {
          const info = CONSENSUS_INFO[m];
          const isActive = mode === m;

          return (
            <button
              key={m}
              onClick={() => handleModeClick(m)}
              disabled={disabled}
              className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50"
                  : "border border-transparent hover:bg-gray-800/50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ color: isActive ? info.color : "#9ca3af" }}
              aria-pressed={isActive}
              aria-label={`Select ${info.chain} consensus mechanism`}
            >
              <span className="text-base block">{info.icon}</span>
              <span className="block mt-0.5 font-semibold text-[10px]">{info.chain}</span>
              <span className="block text-[8px] text-gray-500 truncate max-w-[60px]">
                {info.subtitle.split(" ")[0]}
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
