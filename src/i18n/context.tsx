"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Locale, Translations } from "./types";
import { en } from "./en";
import { ko } from "./ko";

// ==========================================
// TRANSLATIONS MAP
// ==========================================
const translations: Record<Locale, Translations> = {
  en,
  ko,
};

// ==========================================
// CONTEXT TYPE
// ==========================================
interface I18nContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

// ==========================================
// CONTEXT
// ==========================================
const I18nContext = createContext<I18nContextType | null>(null);

// ==========================================
// PROVIDER
// ==========================================
interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function I18nProvider({
  children,
  defaultLocale = "ko",
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Persist to localStorage for next visit
    if (typeof window !== "undefined") {
      localStorage.setItem("consensus-lab-locale", newLocale);
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const newLocale = prev === "en" ? "ko" : "en";
      if (typeof window !== "undefined") {
        localStorage.setItem("consensus-lab-locale", newLocale);
      }
      return newLocale;
    });
  }, []);

  const value = useMemo(
    () => ({
      locale,
      t: translations[locale],
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ==========================================
// HOOK
// ==========================================
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// ==========================================
// UTILITY: Get browser locale
// ==========================================
export function getBrowserLocale(): Locale {
  if (typeof window === "undefined") return "ko";

  // Check localStorage first
  const stored = localStorage.getItem("consensus-lab-locale");
  if (stored === "en" || stored === "ko") return stored;

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("ko")) return "ko";
  return "en";
}
