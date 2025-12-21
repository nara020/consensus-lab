"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { ConsensusMode } from "@/types/consensus";
import { CONSENSUS_INFO } from "@/constants/consensusInfo";
import { useI18n } from "@/i18n";

// ==========================================
// PROPS
// ==========================================
interface ReplayButtonProps {
  onClick: () => void;
  mode: ConsensusMode;
}

// ==========================================
// COMPONENT
// ==========================================
function ReplayButtonComponent({ onClick, mode }: ReplayButtonProps) {
  const { t } = useI18n();
  const info = CONSENSUS_INFO[mode];

  return (
    <motion.div
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[100]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.button
        onClick={onClick}
        className="group relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Replay ${info.chain} simulation`}
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
            🔄 {t.ui.replay} {info.chain}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const ReplayButton = memo(ReplayButtonComponent);
