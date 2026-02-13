"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { StockQuote, TickerMatch } from "@/types/news";
import { fetchStockQuote } from "@/lib/api";

interface CorrelationWidgetProps {
  ticker: TickerMatch;
}

export default function CorrelationWidget({ ticker }: CorrelationWidgetProps) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Correlation");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchStockQuote(ticker.symbol);
        if (!cancelled) setQuote(data);
      } catch {
        // Silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [ticker.symbol]);

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-2 h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (!quote) return null;

  const isPositive = quote.change >= 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 transition-all hover:shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {quote.symbol}
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {ticker.name}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {quote.currency === "KRW"
              ? `₩${quote.price.toLocaleString()}`
              : quote.currency === "JPY"
                ? `¥${quote.price.toLocaleString()}`
                : `$${quote.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
          </div>
          <div
            className={`text-xs font-medium ${
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {quote.change} ({isPositive ? "+" : ""}
            {quote.changePercent}%)
          </div>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        {t("matchedKeyword")}: &quot;{ticker.keyword}&quot;
      </div>
    </div>
  );
}
