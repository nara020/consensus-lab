"use client";

import { memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ConsensusMode } from "@/types/consensus";
import { CONSENSUS_INFO } from "@/constants/consensusInfo";
import { CONSENSUS_DETAILS } from "@/constants/consensusDetails";
import { useI18n } from "@/i18n";

// ==========================================
// PROJECT URLS
// ==========================================
const PROJECT_URLS: Record<ConsensusMode, string> = {
  pow: "https://bitcoin.org",
  pos: "https://ethereum.org",
  raft: "https://www.hyperledger.org/projects/fabric",
  qbft: "https://www.hyperledger.org/projects/besu",
  optimistic: "https://arbitrum.io",
  zk: "https://zksync.io",
  ripple: "https://xrpl.org",
  tendermint: "https://cosmos.network",
  avalanche: "https://www.avax.network",
  sui: "https://sui.io",
};

function getProjectUrl(mode: ConsensusMode): string {
  return PROJECT_URLS[mode];
}

// ==========================================
// PROPS
// ==========================================
interface InfoModalProps {
  mode: ConsensusMode;
  isOpen: boolean;
  onClose: () => void;
}

// ==========================================
// COMPONENT
// ==========================================
function InfoModalComponent({ mode, isOpen, onClose }: InfoModalProps) {
  const { t } = useI18n();
  const info = CONSENSUS_INFO[mode];
  const details = CONSENSUS_DETAILS[mode];

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-10 lg:inset-20 z-[201] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="relative w-full max-w-4xl max-h-full overflow-hidden rounded-2xl border"
              style={{
                background: `linear-gradient(135deg, #0a0a0f, #15151f)`,
                borderColor: `${info.color}30`,
                boxShadow: `0 0 80px ${info.color}20`,
              }}
            >
              {/* Header */}
              <div
                className="relative px-6 py-5 border-b"
                style={{
                  background: `linear-gradient(135deg, ${info.color}15, transparent)`,
                  borderColor: `${info.color}20`,
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  aria-label="Close modal"
                >
                  ✕
                </button>

                <div className="flex items-center gap-4">
                  <motion.span
                    className="text-5xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    {info.icon}
                  </motion.span>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: info.color }}>
                      {info.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-0.5">{info.subtitle}</p>
                  </div>
                </div>

                {/* Security & Finality Badges */}
                <div className="flex gap-3 mt-4">
                  <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 font-medium">
                      🛡️ {details.security.slice(0, 30)}...
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
                    <span className="text-[10px] text-purple-400 font-medium">
                      ⏱️ Finality: {details.finality.split(" - ")[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-y-auto max-h-[60vh] p-6 space-y-6 custom-scrollbar">
                {/* Simulation Steps - 시뮬레이션에서 보여주는 단계 */}
                <Section title="🎬 이 시뮬레이션에서 보여주는 것" icon="" color={info.color}>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                    <ul className="space-y-2">
                      {details.simulationSteps.map((step, i) => (
                        <motion.li
                          key={i}
                          className="text-gray-200 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {step}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </Section>

                {/* Concept Section */}
                <Section title="핵심 개념" icon="💡" color={info.color}>
                  <ul className="space-y-2">
                    {details.concept.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span style={{ color: info.color }}>▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Section>

                {/* Pros & Cons Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Section title="장점" icon="✅" color="#22c55e" compact>
                    <ul className="space-y-1.5">
                      {details.pros.map((item, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section title="단점" icon="⚠️" color="#f59e0b" compact>
                    <ul className="space-y-1.5">
                      {details.cons.map((item, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>

                {/* Technical Specs */}
                <Section title="기술 사양" icon="⚙️" color={info.color}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {details.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                          {spec.label}
                        </div>
                        <div className="text-sm font-medium mt-0.5" style={{ color: info.color }}>
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Using Chains */}
                <Section title="사용 중인 체인" icon="🌐" color={info.color}>
                  <div className="flex flex-wrap gap-2">
                    {details.chains.map((chain, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{
                          background: `${info.color}15`,
                          color: info.color,
                          border: `1px solid ${info.color}30`,
                        }}
                      >
                        {chain}
                      </span>
                    ))}
                  </div>
                </Section>

                {/* Security & Finality Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span>🛡️</span>
                      <span className="font-semibold text-emerald-400">보안 모델</span>
                    </div>
                    <p className="text-gray-300 text-sm">{details.security}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span>⏱️</span>
                      <span className="font-semibold text-purple-400">Finality</span>
                    </div>
                    <p className="text-gray-300 text-sm">{details.finality}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-800/50 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {t.ui.closeModal}
                </span>
                {/* 프로젝트 메인 페이지 링크 */}
                {getProjectUrl(mode) && (
                  <a
                    href={getProjectUrl(mode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105 flex items-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${info.color}30, ${info.color}20)`,
                      color: info.color,
                      border: `1px solid ${info.color}40`,
                    }}
                  >
                    🔗 {t.ui.visitOfficialSite}
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Custom Scrollbar Styles */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// SECTION COMPONENT
// ==========================================
interface SectionProps {
  title: string;
  icon: string;
  color: string;
  compact?: boolean;
  children: React.ReactNode;
}

function Section({ title, icon, color, compact, children }: SectionProps) {
  return (
    <div className={compact ? "" : "space-y-3"}>
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <h3 className="font-semibold text-sm" style={{ color }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const InfoModal = memo(InfoModalComponent);
