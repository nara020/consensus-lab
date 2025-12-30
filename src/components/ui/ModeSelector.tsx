"use client";

import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ConsensusMode, ConsensusCategory } from "@/types/consensus";
import { CONSENSUS_INFO, MODE_CATEGORIES, CATEGORY_INFO } from "@/constants/consensusInfo";

// ==========================================
// PROPS
// ==========================================
interface ModeSelectorProps {
  mode: ConsensusMode;
  onModeChange: (mode: ConsensusMode) => void;
  disabled: boolean; // true = running
}

// ==========================================
// CONSTANTS
// ==========================================
const CATEGORIES: ConsensusCategory[] = ["layer1", "layer2", "alternative"];

const CATEGORY_ICONS: Record<ConsensusCategory, string> = {
  layer1: "⛓️",
  layer2: "🚀",
  alternative: "🌟",
};

const MODES_BY_CATEGORY: Record<ConsensusCategory, ConsensusMode[]> = {
  layer1: ["pow", "pos", "raft", "qbft"],
  layer2: ["optimistic", "zk"],
  alternative: ["ripple", "tendermint", "avalanche", "sui"],
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
  const [hoveredMode, setHoveredMode] = useState<ConsensusMode | null>(null);
  const [isHidden, setIsHidden] = useState(false);

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

  const toggleHidden = useCallback(() => {
    setIsHidden((prev) => !prev);
  }, []);

  const currentModes = MODES_BY_CATEGORY[activeCategory];
  const currentInfo = CONSENSUS_INFO[mode];
  const isRunning = disabled;

  // ==========================================
  // HIDDEN STATE - 숨김 모드
  // ==========================================
  if (isHidden) {
    return (
      <motion.button
        className="absolute top-4 left-4 z-[100] px-3 py-2 rounded-xl bg-black/90 border border-gray-700/50 backdrop-blur-xl"
        onClick={toggleHidden}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentInfo.icon}</span>
          <span className="text-xs text-gray-400">👁</span>
        </div>
      </motion.button>
    );
  }

  // ==========================================
  // MINI MODE - 실행 중 미니 모드
  // ==========================================
  if (isRunning) {
    return (
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[100]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/90 border backdrop-blur-xl"
          style={{
            borderColor: `${currentInfo.color}40`,
            boxShadow: `0 0 20px ${currentInfo.color}20`,
          }}
        >
          {/* Current Mode Icon */}
          <motion.span
            className="text-xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {currentInfo.icon}
          </motion.span>

          {/* Mode Name */}
          <span
            className="text-sm font-bold"
            style={{ color: currentInfo.color }}
          >
            {currentInfo.chain}
          </span>

          {/* Divider */}
          <div className="w-px h-4 bg-gray-700" />

          {/* Running Indicator */}
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              Running
            </span>
          </div>

          {/* Hide Button */}
          <button
            onClick={toggleHidden}
            className="ml-1 p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Hide selector"
          >
            <span className="text-xs text-gray-500">👁</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // FULL MODE - 전체 모드 (기본)
  // ==========================================
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100]">
      {/* Category Tabs */}
      <motion.div
        className="flex justify-center gap-1.5 mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {CATEGORIES.map((category) => {
          const categoryInfo = CATEGORY_INFO[category];
          const isActive = activeCategory === category;
          const hasActiveMode = MODES_BY_CATEGORY[category].includes(mode);
          const modeCount = MODES_BY_CATEGORY[category].length;

          return (
            <motion.button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`relative px-4 py-1.5 rounded-full text-[11px] font-bold transition-all overflow-hidden ${
                isActive ? "shadow-lg" : "hover:bg-white/5"
              }`}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${categoryInfo.color}20, ${categoryInfo.color}10)`
                  : "transparent",
                border: isActive
                  ? `1px solid ${categoryInfo.color}50`
                  : "1px solid transparent",
                color: hasActiveMode
                  ? categoryInfo.color
                  : isActive
                  ? categoryInfo.color
                  : "#6b7280",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-1.5">{CATEGORY_ICONS[category]}</span>
              {categoryInfo.name}
              <span className="ml-1.5 text-[9px] opacity-60">({modeCount})</span>
              {hasActiveMode && !isActive && (
                <motion.span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryInfo.color }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Mode Buttons */}
      <motion.div
        className="relative bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{
          boxShadow: `0 0 40px ${CATEGORY_INFO[activeCategory].color}10`,
        }}
      >
        {/* Glow Effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 blur-xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${CATEGORY_INFO[activeCategory].color}30, transparent 70%)`,
          }}
        />

        <div className="relative flex gap-1.5">
          <AnimatePresence mode="wait">
            {currentModes.map((m, index) => {
              const info = CONSENSUS_INFO[m];
              const isActive = mode === m;
              const isHovered = hoveredMode === m;

              return (
                <motion.button
                  key={m}
                  onClick={() => handleModeClick(m)}
                  onMouseEnter={() => setHoveredMode(m)}
                  onMouseLeave={() => setHoveredMode(null)}
                  disabled={disabled}
                  className={`relative px-4 py-2.5 rounded-xl font-mono text-xs transition-all overflow-hidden group ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${info.color}30, ${info.color}15)`
                      : isHovered
                      ? `linear-gradient(135deg, ${info.color}15, ${info.color}08)`
                      : "transparent",
                    border: isActive
                      ? `1px solid ${info.color}60`
                      : "1px solid transparent",
                    color: isActive ? info.color : "#9ca3af",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
                  whileTap={{ scale: disabled ? 1 : 0.97 }}
                  aria-pressed={isActive}
                  aria-label={`Select ${info.chain} consensus mechanism`}
                >
                  {/* Active Glow */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl opacity-30 blur-md"
                      style={{ backgroundColor: info.color }}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.span
                    className="text-xl block relative z-10"
                    animate={
                      isActive
                        ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    {info.icon}
                  </motion.span>

                  {/* Chain Name */}
                  <span
                    className="block mt-1 font-bold text-[11px] relative z-10 whitespace-nowrap"
                    style={{ color: isActive ? info.color : undefined }}
                  >
                    {info.chain}
                  </span>

                  {/* Subtitle */}
                  <span className="block text-[8px] text-gray-500 truncate max-w-[70px] relative z-10">
                    {info.subtitle.split(" ")[0]}
                  </span>

                  {/* Hover indicator */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 h-0.5 rounded-full"
                    style={{ backgroundColor: info.color }}
                    initial={{ width: 0, x: "-50%" }}
                    animate={{
                      width: isActive ? "60%" : isHovered ? "40%" : 0,
                      x: "-50%",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Category Label */}
        <motion.div
          className="mt-2 pt-2 border-t border-gray-800/50 text-center"
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span
            className="text-[9px] font-medium tracking-wider uppercase"
            style={{ color: CATEGORY_INFO[activeCategory].color }}
          >
            {activeCategory === "layer1" && "Base Layer Consensus"}
            {activeCategory === "layer2" && "Scaling Solutions"}
            {activeCategory === "alternative" && "Modern Protocols"}
          </span>
        </motion.div>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredMode && !disabled && (
          <motion.div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-2 bg-black/95 border border-gray-700/50 rounded-lg shadow-xl backdrop-blur-xl z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              maxWidth: "280px",
              boxShadow: `0 0 30px ${CONSENSUS_INFO[hoveredMode].color}20`,
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{CONSENSUS_INFO[hoveredMode].icon}</span>
              <span
                className="font-bold text-sm"
                style={{ color: CONSENSUS_INFO[hoveredMode].color }}
              >
                {CONSENSUS_INFO[hoveredMode].name}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              {CONSENSUS_INFO[hoveredMode].description[0]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const ModeSelector = memo(ModeSelectorComponent);
