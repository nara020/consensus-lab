"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const ConsensusVisualization = dynamic(
  () => import("@/components/ConsensusVisualization"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#030308] flex items-center justify-center">
        <motion.div
          className="text-cyan-400 text-sm font-mono"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Consensus Lab...
        </motion.div>
      </div>
    ),
  }
);

export default function Home() {
  return <ConsensusVisualization />;
}
