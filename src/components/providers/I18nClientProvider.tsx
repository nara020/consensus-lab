"use client";

import { type ReactNode } from "react";
import { I18nProvider, getBrowserLocale } from "@/i18n";

interface I18nClientProviderProps {
  children: ReactNode;
}

export function I18nClientProvider({ children }: I18nClientProviderProps) {
  // Get locale once - no state changes that could cause remounts
  const locale = typeof window !== "undefined" ? getBrowserLocale() : "ko";

  return <I18nProvider defaultLocale={locale}>{children}</I18nProvider>;
}
