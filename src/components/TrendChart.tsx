"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getTopKeywords } from "@/lib/trend-tracker";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

interface TooltipData {
  x: number;
  y: number;
  keyword: string;
  count: number;
  date: string;
}

export default function TrendChart() {
  const [keywords, setKeywords] = useState<
    { keyword: string; data: { date: string; count: number }[] }[]
  >([]);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const t = useTranslations("TrendChart");

  useEffect(() => {
    const data = getTopKeywords(7, 5);
    setKeywords(data);
  }, []);

  if (keywords.length === 0) {
    return null;
  }

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 500;
  const height = 250;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allCounts = keywords.flatMap((k) => k.data.map((d) => d.count));
  const maxCount = Math.max(1, ...allCounts);
  const days = keywords[0]?.data.length || 7;

  function getX(i: number): number {
    return padding.left + (i / Math.max(1, days - 1)) * chartW;
  }

  function getY(count: number): number {
    return padding.top + chartH - (count / maxCount) * chartH;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
        {t("title")}
      </h3>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1={padding.left}
              y1={padding.top + chartH * (1 - frac)}
              x2={padding.left + chartW}
              y2={padding.top + chartH * (1 - frac)}
              stroke="currentColor"
              strokeOpacity={0.1}
              className="text-gray-400"
            />
          ))}

          {/* Lines */}
          {keywords.map((kw, ki) => {
            const points = kw.data
              .map((d, i) => `${getX(i)},${getY(d.count)}`)
              .join(" ");
            return (
              <g key={kw.keyword}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={COLORS[ki % COLORS.length]}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {kw.data.map((d, i) => (
                  <circle
                    key={i}
                    cx={getX(i)}
                    cy={getY(d.count)}
                    r={3}
                    fill={COLORS[ki % COLORS.length]}
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setTooltip({
                        x: getX(i),
                        y: getY(d.count),
                        keyword: kw.keyword,
                        count: d.count,
                        date: d.date,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </g>
            );
          })}

          {/* X-axis labels */}
          {keywords[0]?.data.map((d, i) => {
            if (days > 7 && i % 2 !== 0) return null;
            const dateStr = new Date(d.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
            return (
              <text
                key={i}
                x={getX(i)}
                y={height - 5}
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                className="text-gray-400"
              >
                {dateStr}
              </text>
            );
          })}

          {/* Y-axis labels */}
          {[0, 0.5, 1].map((frac) => (
            <text
              key={frac}
              x={padding.left - 5}
              y={padding.top + chartH * (1 - frac) + 3}
              textAnchor="end"
              fontSize="9"
              fill="currentColor"
              className="text-gray-400"
            >
              {Math.round(maxCount * frac)}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs shadow-md dark:border-gray-600 dark:bg-gray-800"
            style={{
              left: `${(tooltip.x / width) * 100}%`,
              top: `${(tooltip.y / height) * 100 - 8}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {tooltip.keyword}: {tooltip.count}
            </div>
            <div className="text-gray-400">{tooltip.date}</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3">
        {keywords.map((kw, i) => (
          <div key={kw.keyword} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {kw.keyword}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
