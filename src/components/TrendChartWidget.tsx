"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getTopKeywords } from "@/lib/trend-tracker";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

export default function TrendChartWidget() {
  const [keywords, setKeywords] = useState<
    { keyword: string; data: { date: string; count: number }[] }[]
  >([]);
  const t = useTranslations("TrendChart");

  useEffect(() => {
    const data = getTopKeywords(7, 5);
    setKeywords(data);
  }, []);

  if (keywords.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
        {t("widgetTitle")}
      </h3>
      <div className="space-y-2">
        {keywords.map((kw, i) => {
          const max = Math.max(1, ...kw.data.map((d) => d.count));
          const total = kw.data.reduce((sum, d) => sum + d.count, 0);
          const points = kw.data
            .map((d, j) => {
              const x = (j / Math.max(1, kw.data.length - 1)) * 80;
              const y = 20 - (d.count / max) * 18;
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <div key={kw.keyword} className="flex items-center gap-2">
              <div
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="w-20 truncate text-xs text-gray-700 dark:text-gray-300">
                {kw.keyword}
              </span>
              <svg viewBox="0 0 80 22" className="h-5 flex-1">
                <polyline
                  points={points}
                  fill="none"
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
