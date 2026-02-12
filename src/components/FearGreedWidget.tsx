"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { FearGreedData } from "@/types/news";
import { fetchFearGreed } from "@/lib/api";

function getGaugeColor(value: number): string {
  if (value <= 20) return "#ea3943"; // Extreme Fear - red
  if (value <= 40) return "#ea8c00"; // Fear - orange
  if (value <= 60) return "#f5d100"; // Neutral - yellow
  if (value <= 80) return "#16c784"; // Greed - green
  return "#00b7c2"; // Extreme Greed - teal
}

function getClassificationKey(classification: string): string {
  const map: Record<string, string> = {
    "Extreme Fear": "extremeFear",
    Fear: "fear",
    Neutral: "neutral",
    Greed: "greed",
    "Extreme Greed": "extremeGreed",
  };
  return map[classification] || "neutral";
}

export default function FearGreedWidget() {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = useTranslations("FearGreed");

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchFearGreed()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  const value = data?.value ?? 50;
  const color = getGaugeColor(value);
  // SVG arc for semicircle gauge
  const angle = (value / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const r = 70;
  const cx = 80;
  const cy = 80;
  const x = cx - r * Math.cos(rad);
  const y = cy - r * Math.sin(rad);
  const largeArc = angle > 90 ? 1 : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
        <span className="text-base">😰</span>
        {t("title")}
      </h3>

      {loading && (
        <div className="flex justify-center py-6">
          <div className="h-24 w-40 animate-pulse rounded-t-full bg-gray-100 dark:bg-gray-700" />
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

      {!loading && !error && data && (
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 160 100" className="w-40">
            {/* Background arc */}
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              className="text-gray-200 dark:text-gray-600"
            />
            {/* Value arc */}
            <path
              d={`M 10 80 A 70 70 0 ${largeArc} 1 ${x.toFixed(1)} ${y.toFixed(1)}`}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Value text */}
            <text
              x="80"
              y="72"
              textAnchor="middle"
              className="fill-gray-900 dark:fill-gray-100"
              fontSize="28"
              fontWeight="bold"
            >
              {value}
            </text>
          </svg>
          <span
            className="mt-1 text-sm font-bold"
            style={{ color }}
          >
            {t(getClassificationKey(data.classification))}
          </span>
        </div>
      )}
    </div>
  );
}
