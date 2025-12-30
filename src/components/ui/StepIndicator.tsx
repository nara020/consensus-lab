"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// PROPS
// ==========================================
interface StepIndicatorProps {
  step: number;
  totalSteps: number;
  description: string;
}

// ==========================================
// COMPONENT
// ==========================================
function StepIndicatorComponent({
  step,
  totalSteps,
  description,
}: StepIndicatorProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
      {/* 하단 그라데이션 배경 (자막 영역 확보) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)",
        }}
      />

      {/* 자막 컨테이너 */}
      <div className="relative pb-6 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={description}
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* 단계 표시 */}
            <div className="flex justify-center gap-1.5 mb-2">
              {Array.from({ length: Math.min(totalSteps, 6) }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: i === (step - 1) % 6 ? "24px" : "8px",
                    backgroundColor:
                      i <= (step - 1) % 6 ? "#22d3ee" : "rgba(255,255,255,0.2)",
                  }}
                  animate={
                    i === (step - 1) % 6
                      ? { opacity: [0.7, 1, 0.7] }
                      : {}
                  }
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              ))}
            </div>

            {/* 자막 텍스트 */}
            <div className="text-center">
              <motion.p
                className="text-white text-base md:text-lg font-medium leading-relaxed px-4 py-2"
                style={{
                  textShadow: "0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)",
                }}
              >
                {description}
              </motion.p>
            </div>

            {/* 진행률 표시 */}
            <div className="flex justify-center items-center gap-3 mt-2">
              <span className="text-[10px] text-gray-400 font-mono">
                STEP {step}
              </span>
              <div className="w-20 h-0.5 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                  style={{ width: `${Math.min((step / 150) * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const StepIndicator = memo(StepIndicatorComponent);
