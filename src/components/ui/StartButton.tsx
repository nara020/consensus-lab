"use client";

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { ConsensusMode } from "@/types/consensus";
import { CONSENSUS_INFO } from "@/constants/consensusInfo";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.button
        onClick={onClick}
        className="group relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
