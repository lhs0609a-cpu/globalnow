"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { StockIndex } from "@/types/news";
import { fetchStockIndices } from "@/lib/api";

export default function StockIndicesWidget() {
  const [stocks, setStocks] = useState<StockIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = useTranslations("Stocks");

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchStockIndices()
      .then(setStocks)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
        <span className="text-base">📊</span>
        {t("title")}
      </h3>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-8 animate-pulse rounded bg-gray-100 dark:bg-gray-700"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center">
          <p className="mb-2 text-xs text-red-500 dark:text-red-400">
            {t("error")}
          </p>
          <button
            onClick={load}
            className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700"
          >
            {t("retry")}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-1">
          {stocks.map((s) => (
            <div
              key={s.symbol}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {s.name}
                </span>
                <span className="text-[10px] text-gray-400">({s.symbol})</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {s.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-[10px] font-medium ${
                    s.changePercent > 0
                      ? "text-red-500"
                      : s.changePercent < 0
                        ? "text-blue-500"
                        : "text-gray-400"
                  }`}
                >
                  {s.changePercent > 0 ? "+" : ""}
                  {s.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
