"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { ExchangeRateChange } from "@/types/news";
import { fetchExchangeRates } from "@/lib/api";

const CURRENCY_LABELS: Record<string, Record<string, string>> = {
  KRW: { ko: "달러/원", en: "USD/KRW", ja: "ドル/ウォン" },
  EUR: { ko: "유로/원", en: "EUR/KRW", ja: "ユーロ/ウォン" },
  JPY: { ko: "엔원(100)", en: "JPY/KRW", ja: "円/ウォン" },
  GBP: { ko: "파운드/원", en: "GBP/KRW", ja: "ポンド/ウォン" },
  CNY: { ko: "위안/원", en: "CNY/KRW", ja: "元/ウォン" },
};

export default function ExchangeRateWidget() {
  const [rates, setRates] = useState<ExchangeRateChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = useTranslations("Exchange");
  const tn = useTranslations("News");

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchExchangeRates()
      .then(setRates)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
        <span className="text-base">💱</span>
        {t("title")}
      </h3>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
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
            {tn("retry")}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-2">
          {rates.map((r) => (
            <div
              key={r.currency}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {CURRENCY_LABELS[r.currency]?.ko ?? r.currency}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {r.rate.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`ml-2 text-xs font-medium ${
                    r.change > 0
                      ? "text-red-500"
                      : r.change < 0
                        ? "text-blue-500"
                        : "text-gray-400"
                  }`}
                >
                  {r.change > 0 ? "+" : ""}
                  {r.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
