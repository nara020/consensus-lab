"use client";

import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { ConsensusMode } from "@/types/consensus";
import { CONSENSUS_INFO } from "@/constants/consensusInfo";
import { useI18n } from "@/i18n";
import { InfoModal } from "./InfoModal";

// ==========================================
// PROPS
// ==========================================
interface InfoPanelProps {
  mode: ConsensusMode;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

// ==========================================
// COMPONENT
// ==========================================
function InfoPanelComponent({ mode, minimized = false, onToggleMinimize }: InfoPanelProps) {
  const { t } = useI18n();
  const info = CONSENSUS_INFO[mode];
  const translations = t.consensus[mode];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <motion.div
        className="absolute top-32 right-4 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        key={mode}
        layout
      >
        <motion.div
          className="bg-black/95 backdrop-blur-xl border rounded-xl overflow-hidden"
          style={{
            borderColor: `${info.color}30`,
            boxShadow: `0 0 30px ${info.color}10`,
          }}
          layout
          animate={{ width: minimized ? "auto" : 260 }}
        >
          {/* Header - Always visible, clickable to toggle */}
          <div
            className={`px-4 py-3 ${!minimized ? "border-b" : ""} cursor-pointer`}
            style={{
              background: `linear-gradient(135deg, ${info.color}15, transparent)`,
              borderColor: `${info.color}15`,
            }}
            onClick={onToggleMinimize}
          >
            <div
              className="font-bold text-sm flex items-center gap-2"
              style={{ color: info.color }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {info.icon}
              </motion.span>
              {!minimized && translations.chain}
              {onToggleMinimize && (
                <motion.span
                  className="ml-auto text-gray-500 text-xs"
                  animate={{ rotate: minimized ? 180 : 0 }}
                >
                  {minimized ? "◀" : "▶"}
                </motion.span>
              )}
            </div>
            {!minimized && (
              <div className="text-[10px] text-gray-500 mt-0.5">{translations.subtitle}</div>
            )}
          </div>

          {/* Content - Hidden when minimized */}
          {!minimized && (
            <>
              <div className="px-4 py-3 space-y-2">
                {translations.descriptions.slice(0, 3).map((line, i) => (
                  <motion.p
                    key={i}
                    className="text-[11px] text-gray-300 leading-relaxed flex items-start gap-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-gray-500">▸</span>
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* Learn More Button */}
              <div className="px-4 py-3 border-t border-gray-800/50">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal();
                  }}
                  className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${info.color}20, ${info.color}10)`,
                    color: info.color,
                    border: `1px solid ${info.color}30`,
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 0 20px ${info.color}30`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>📖</span>
                  {t.ui.viewDetails}
                  <span className="text-[10px] opacity-60">→</span>
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Modal */}
      <InfoModal mode={mode} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const InfoPanel = memo(InfoPanelComponent);
