"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";

// ==========================================
// COMPONENT
// ==========================================
function LanguageToggleComponent() {
  const { locale, toggleLocale } = useI18n();

  return (
    <motion.button
      className="absolute top-6 right-4 z-[100] bg-black/80 backdrop-blur-md border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-800/80 transition-all"
      onClick={toggleLocale}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch language to ${locale === "en" ? "Korean" : "English"}`}
    >
      <span className="text-lg">{locale === "en" ? "🇺🇸" : "🇰🇷"}</span>
      <span className="text-xs font-mono text-gray-300 uppercase">
        {locale === "en" ? "EN" : "KO"}
      </span>
    </motion.button>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const LanguageToggle = memo(LanguageToggleComponent);
