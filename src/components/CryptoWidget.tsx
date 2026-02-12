"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { CryptoPrice } from "@/types/news";
import { fetchCrypto } from "@/lib/api";

const COIN_ICONS: Record<string, string> = {
  bitcoin: "🪙",
  ethereum: "💎",
  solana: "⚡",
};

const COIN_NAMES: Record<string, Record<string, string>> = {
  bitcoin: { ko: "비트코인", en: "Bitcoin", ja: "ビットコイン" },
  ethereum: { ko: "이더리움", en: "Ethereum", ja: "イーサリアム" },
  solana: { ko: "솔라나", en: "Solana", ja: "ソラナ" },
};

export default function CryptoWidget() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = useTranslations("Crypto");

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchCrypto()
      .then(setPrices)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
        <span className="text-base">🪙</span>
        {t("title")}
      </h3>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded bg-gray-100 dark:bg-gray-700"
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
          {prices.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {COIN_ICONS[coin.id] || "🪙"}
                </span>
                <div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {COIN_NAMES[coin.id]?.ko ?? coin.id}
                  </span>
                  <span className="ml-1 text-[10px] text-gray-400">
                    {coin.symbol}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  ${coin.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-[10px] font-medium ${
                    coin.changePercent > 0
                      ? "text-red-500"
                      : coin.changePercent < 0
                        ? "text-blue-500"
                        : "text-gray-400"
                  }`}
                >
                  {coin.changePercent > 0 ? "+" : ""}
                  {coin.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
