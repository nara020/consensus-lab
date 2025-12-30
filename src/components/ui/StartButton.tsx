"use client";

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { ConsensusMode } from "@/types/consensus";
import { CONSENSUS_INFO } from "@/constants/consensusInfo";
import { CONSENSUS_DETAILS } from "@/constants/consensusDetails";
import { useI18n } from "@/i18n";

// ==========================================
// PROPS
// ==========================================
interface StartButtonProps {
  onClick: () => void;
  mode: ConsensusMode;
}

// ==========================================
// COMPONENT
// ==========================================
function StartButtonComponent({ onClick, mode }: StartButtonProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  const info = CONSENSUS_INFO[mode];
  const details = CONSENSUS_DETAILS[mode];

  useEffect(() => {
    // Intentional: Prevent hydration mismatch by mounting on client only
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Simulation Steps Preview */}
      <motion.div
        className="mb-4 bg-black/90 backdrop-blur-xl border rounded-xl overflow-hidden max-w-md"
        style={{
          borderColor: `${info.color}30`,
          boxShadow: `0 0 40px ${info.color}15`,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className="px-4 py-2 border-b text-xs font-semibold flex items-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${info.color}15, transparent)`,
            borderColor: `${info.color}20`,
            color: info.color,
          }}
        >
          <span>🎬</span>
          {t.ui.simulationSteps || "Simulation Steps"}
        </div>
        <div className="px-4 py-3 space-y-1.5 max-h-48 overflow-y-auto">
          {details.simulationSteps.map((step, i) => (
            <motion.div
              key={i}
              className="text-[11px] text-gray-300 flex items-start gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <span className="text-gray-500 shrink-0">{step.slice(0, 2)}</span>
              <span>{step.slice(2).trim()}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.button
        onClick={onClick}
        className="group relative w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Start ${info.chain} simulation`}
      >
        <div
          className="absolute inset-0 rounded-xl blur-xl opacity-50"
          style={{ backgroundColor: info.color }}
        />
        <div
          className="relative bg-black/90 border-2 rounded-xl px-8 py-4 transition-all hover:bg-black/80"
          style={{ borderColor: info.color }}
        >
          <span
            className="font-mono text-sm tracking-wider uppercase"
            style={{ color: info.color }}
          >
            {info.icon} {t.ui.startSimulation} - {info.chain}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const StartButton = memo(StartButtonComponent);
