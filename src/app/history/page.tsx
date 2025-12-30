"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/i18n";
import {
  CONSENSUS_HISTORY,
  CATEGORY_LABELS,
  type ConsensusHistoryEvent,
} from "@/constants/consensusHistory";

// ==========================================
// TYPES
// ==========================================
type CategoryFilter = ConsensusHistoryEvent["category"] | "all";

// ==========================================
// TIMELINE EVENT CARD
// ==========================================
function TimelineEvent({
  event,
  index,
  isExpanded,
  onToggle,
}: {
  event: ConsensusHistoryEvent;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useI18n();

  return (
    <motion.div
      className="relative pl-8 pb-8 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Timeline line */}
      <div
        className="absolute left-[11px] top-6 bottom-0 w-0.5"
        style={{ backgroundColor: `${event.color}30` }}
      />

      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs"
        style={{
          backgroundColor: `${event.color}20`,
          border: `2px solid ${event.color}`,
        }}
        whileHover={{ scale: 1.2 }}
      >
        {event.icon}
      </motion.div>

      {/* Content card */}
      <motion.div
        className="bg-black/60 backdrop-blur-sm border rounded-xl overflow-hidden cursor-pointer"
        style={{ borderColor: `${event.color}30` }}
        whileHover={{
          borderColor: event.color,
          boxShadow: `0 0 20px ${event.color}20`,
        }}
        onClick={onToggle}
      >
        {/* Header */}
        <div
          className="px-4 py-3"
          style={{
            background: `linear-gradient(135deg, ${event.color}15, transparent)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Year badge */}
              <span
                className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                style={{
                  backgroundColor: `${event.color}20`,
                  color: event.color,
                }}
              >
                {event.year}
                {event.month && `.${event.month.toString().padStart(2, "0")}`}
              </span>

              {/* Category badge */}
              <span
                className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider"
                style={{
                  backgroundColor: `${CATEGORY_LABELS[event.category].color}20`,
                  color: CATEGORY_LABELS[event.category].color,
                }}
              >
                {CATEGORY_LABELS[event.category].ko}
              </span>
            </div>

            {/* Algorithm tag */}
            <span className="text-xs text-gray-500 font-mono">
              {event.algorithm}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-bold mt-2 text-sm">{event.title}</h3>
        </div>

        {/* Description */}
        <div className="px-4 py-3 border-t" style={{ borderColor: `${event.color}15` }}>
          <p className="text-gray-400 text-xs leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Expandable details */}
        <AnimatePresence>
          {isExpanded && event.details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className="px-4 py-3 border-t space-y-1.5"
                style={{
                  borderColor: `${event.color}15`,
                  backgroundColor: `${event.color}05`,
                }}
              >
                {event.details.map((detail, i) => (
                  <p key={i} className="text-[11px] text-gray-300 flex items-start gap-2">
                    <span style={{ color: event.color }}>•</span>
                    {detail}
                  </p>
                ))}
              </div>

              {/* Links */}
              {event.links && event.links.length > 0 && (
                <div
                  className="px-4 py-2 border-t flex gap-2"
                  style={{ borderColor: `${event.color}15` }}
                >
                  <span className="text-[10px] text-gray-500">{t.history.references}:</span>
                  {event.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] underline hover:no-underline"
                      style={{ color: event.color }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand indicator */}
        {event.details && (
          <div className="px-4 py-2 border-t flex justify-center" style={{ borderColor: `${event.color}10` }}>
            <motion.span
              className="text-[10px] text-gray-500"
              animate={{ rotate: isExpanded ? 180 : 0 }}
            >
              {isExpanded ? "▲" : "▼"} {t.history.viewDetails}
            </motion.span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// CATEGORY FILTER TABS
// ==========================================
function CategoryTabs({
  selected,
  onSelect,
}: {
  selected: CategoryFilter;
  onSelect: (cat: CategoryFilter) => void;
}) {
  const { t } = useI18n();

  const categories: { key: CategoryFilter; label: string; color: string }[] = [
    { key: "all", label: t.history.categories.all, color: "#6b7280" },
    { key: "academic", label: t.history.categories.academic, color: CATEGORY_LABELS.academic.color },
    { key: "mainnet", label: t.history.categories.mainnet, color: CATEGORY_LABELS.mainnet.color },
    { key: "upgrade", label: t.history.categories.upgrade, color: CATEGORY_LABELS.upgrade.color },
    { key: "layer2", label: t.history.categories.layer2, color: CATEGORY_LABELS.layer2.color },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <motion.button
          key={cat.key}
          className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: selected === cat.key ? `${cat.color}30` : "transparent",
            color: selected === cat.key ? cat.color : "#6b7280",
            border: `1px solid ${selected === cat.key ? cat.color : "#374151"}`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.key)}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}

// ==========================================
// DECADE MARKERS
// ==========================================
function DecadeMarker({ year }: { year: number }) {
  return (
    <motion.div
      className="relative my-8 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-700" />
      </div>
      <div className="relative px-4 py-1 bg-gray-900 border border-gray-700 rounded-full">
        <span className="text-gray-400 text-sm font-mono font-bold">{year}s</span>
      </div>
    </motion.div>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function HistoryPage() {
  const { t } = useI18n();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (categoryFilter === "all") return CONSENSUS_HISTORY;
    return CONSENSUS_HISTORY.filter((e) => e.category === categoryFilter);
  }, [categoryFilter]);

  // Group events by decade for markers
  const eventsWithDecades = useMemo(() => {
    const result: (ConsensusHistoryEvent | { type: "decade"; year: number })[] = [];
    let currentDecade = 0;

    filteredEvents.forEach((event) => {
      const decade = Math.floor(event.year / 10) * 10;
      if (decade !== currentDecade) {
        currentDecade = decade;
        result.push({ type: "decade", year: decade });
      }
      result.push(event);
    });

    return result;
  }, [filteredEvents]);

  return (
    <div className="min-h-screen bg-[#030308] text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-6 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors"
          >
            {t.history.backToLab}
          </Link>

          {/* Title */}
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {t.history.title}
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {t.history.subtitle}
          </motion.p>

          {/* Category filters */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CategoryTabs selected={categoryFilter} onSelect={setCategoryFilter} />
          </motion.div>
        </div>
      </header>

      {/* Timeline */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            key={categoryFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {eventsWithDecades.map((item, index) => {
              if ("type" in item && item.type === "decade") {
                return <DecadeMarker key={`decade-${item.year}`} year={item.year} />;
              }

              const event = item as ConsensusHistoryEvent;
              const eventIndex = CONSENSUS_HISTORY.indexOf(event);

              return (
                <TimelineEvent
                  key={`${event.year}-${event.algorithm}-${event.title}`}
                  event={event}
                  index={index}
                  isExpanded={expandedIndex === eventIndex}
                  onToggle={() =>
                    setExpandedIndex(expandedIndex === eventIndex ? null : eventIndex)
                  }
                />
              );
            })}
          </motion.div>

          {/* Stats footer */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {CONSENSUS_HISTORY.length}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Events</div>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {CONSENSUS_HISTORY[CONSENSUS_HISTORY.length - 1].year -
                    CONSENSUS_HISTORY[0].year}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Years</div>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {new Set(CONSENSUS_HISTORY.map((e) => e.algorithm)).size}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Algorithms</div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <a
            href="https://github.com/nara020/consensus-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-400 text-xs font-mono flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View Source
          </a>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-400 text-xs font-mono"
          >
            Consensus Lab →
          </Link>
        </div>
      </footer>
    </div>
  );
}
