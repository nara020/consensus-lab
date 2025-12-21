"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { ConsensusMode } from "@/types/consensus";
import { CONSENSUS_INFO } from "@/constants/consensusInfo";
import { useI18n } from "@/i18n";

// ==========================================
// PROPS
// ==========================================
interface InfoPanelProps {
  mode: ConsensusMode;
}

// ==========================================
// COMPONENT
// ==========================================
function InfoPanelComponent({ mode }: InfoPanelProps) {
  const { t } = useI18n();
  const info = CONSENSUS_INFO[mode];
  const translations = t.consensus[mode];

  return (
    <motion.div
      className="absolute top-32 right-4 z-20 max-w-[240px]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      key={mode}
    >
      <div className="bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg p-4">
        <div
          className="font-semibold mb-1 text-sm flex items-center gap-2"
          style={{ color: info.color }}
        >
          {info.icon} {translations.chain}
        </div>
        <div className="text-xs text-gray-400 mb-3">{translations.subtitle}</div>
        <div className="text-[11px] text-gray-300 space-y-1.5">
          {translations.descriptions.map((line, i) => (
            <p key={i} className="leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const InfoPanel = memo(InfoPanelComponent);
