"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";

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
  const steps = useMemo(
    () => Array.from({ length: totalSteps }, (_, i) => i),
    [totalSteps]
  );

  return (
    <motion.div
      className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={step}
    >
      <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-xl px-6 py-3 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {steps.map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < step
                  ? "bg-cyan-400"
                  : i === step
                  ? "bg-cyan-400 animate-pulse scale-125"
                  : "bg-gray-600"
              }`}
              aria-label={`Step ${i + 1} of ${totalSteps}`}
            />
          ))}
        </div>
        <p className="text-cyan-400 text-sm font-mono">{description}</p>
      </div>
    </motion.div>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const StepIndicator = memo(StepIndicatorComponent);
