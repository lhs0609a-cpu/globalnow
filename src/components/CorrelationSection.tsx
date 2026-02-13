"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { TickerMatch } from "@/types/news";
import { findTickersForText } from "@/data/keyword-ticker-map";
import CorrelationWidget from "./CorrelationWidget";

interface CorrelationSectionProps {
  text: string;
}

export default function CorrelationSection({ text }: CorrelationSectionProps) {
  const [tickers, setTickers] = useState<TickerMatch[]>([]);
  const t = useTranslations("Correlation");

  useEffect(() => {
    if (!text) return;
    const matches = findTickersForText(text);
    setTickers(matches);
  }, [text]);

  if (tickers.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
          />
        </svg>
        {t("title")}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tickers.map((ticker) => (
          <CorrelationWidget key={ticker.symbol} ticker={ticker} />
        ))}
      </div>
    </div>
  );
}
