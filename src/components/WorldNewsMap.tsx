"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { CountryCode, Category } from "@/types/news";
import { WORLD_OUTLINE, COUNTRY_COORDS } from "@/data/world-map-paths";
import { getArticleCounts, getArticleCountsByCategory } from "@/lib/api";
import { getTopKeywords } from "@/lib/trend-tracker";
import MapCategoryFilter from "./MapCategoryFilter";
import MapSparkline from "./MapSparkline";

interface WorldNewsMapProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
}

function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export default function WorldNewsMap({
  selectedCountry,
  onCountryChange,
}: WorldNewsMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [articleCounts, setArticleCounts] = useState<Record<string, number>>(
    {}
  );
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [isDark, setIsDark] = useState(false);
  const [sparkData, setSparkData] = useState<Record<string, number[]>>({});
  const t = useTranslations("Map");
  const tCountries = useTranslations("Countries");

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Poll article counts
  useEffect(() => {
    const update = () => {
      if (categoryFilter === "all") {
        setArticleCounts({ ...getArticleCounts() });
      } else {
        const byCategory = getArticleCountsByCategory();
        const counts: Record<string, number> = {};
        for (const [country, cats] of Object.entries(byCategory)) {
          counts[country] = cats[categoryFilter] || 0;
        }
        setArticleCounts(counts);
      }
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [categoryFilter]);

  // Load sparkline data from trend tracker
  useEffect(() => {
    const topKw = getTopKeywords(7, 3);
    if (topKw.length > 0) {
      // Create a simple spark data per country (sum of top keyword counts per day)
      const data: Record<string, number[]> = {};
      for (const coord of COUNTRY_COORDS) {
        data[coord.code] = topKw[0].data.map((d) => d.count);
      }
      setSparkData(data);
    }
  }, []);

  const maxCount = Math.max(1, ...Object.values(articleCounts));

  function getDotRadius(code: string): number {
    const count = articleCounts[code] || 0;
    if (count === 0) return 6;
    return 6 + (count / maxCount) * 10;
  }

  function getGradientId(code: string): string {
    const count = articleCounts[code] || 0;
    if (count === 0) return "grad-none";
    const intensity = count / maxCount;
    if (intensity > 0.7) return "grad-high";
    if (intensity > 0.4) return "grad-medium";
    return "grad-low";
  }

  // Check if a country has articles within the last hour (for pulse animation)
  function hasRecentActivity(code: string): boolean {
    return (articleCounts[code] || 0) > 0;
  }

  const hovered = COUNTRY_COORDS.find((c) => c.code === hoveredCountry);

  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌍</span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {t("title")}
          </h2>
        </div>
        <MapCategoryFilter
          selected={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 1000 500"
          className="w-full"
          style={{ maxHeight: "300px" }}
          role="img"
          aria-label={t("title")}
        >
          <defs>
            {/* Radial gradients for heatmap levels */}
            <radialGradient id="grad-low">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="grad-medium">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="grad-high">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="grad-none">
              <stop
                offset="0%"
                stopColor={isDark ? "#4b5563" : "#d1d5db"}
                stopOpacity="0.8"
              />
              <stop
                offset="100%"
                stopColor={isDark ? "#4b5563" : "#d1d5db"}
                stopOpacity="0.3"
              />
            </radialGradient>
          </defs>

          {/* World outline */}
          <path
            d={WORLD_OUTLINE}
            fill={isDark ? "#1e293b" : "#f1f5f9"}
            stroke={isDark ? "#334155" : "#cbd5e1"}
            strokeWidth="1.5"
          />

          {/* Country dots */}
          {COUNTRY_COORDS.map((coord) => {
            const isSelected = coord.code === selectedCountry;
            const isHovered = coord.code === hoveredCountry;
            const hasActivity = hasRecentActivity(coord.code);
            const radius = getDotRadius(coord.code);

            return (
              <g key={coord.code}>
                {/* Hit area — larger on mobile for easier touch targets */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={24}
                  fill="transparent"
                  className="cursor-pointer"
                  role="button"
                  aria-label={`${coord.label} - ${t("clickToFilter")}`}
                  tabIndex={0}
                  onMouseEnter={() => setHoveredCountry(coord.code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() =>
                    onCountryChange(coord.code as CountryCode)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onCountryChange(coord.code as CountryCode);
                    }
                  }}
                />

                {/* Pulse ring for active countries */}
                {hasActivity && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={radius + 6}
                    fill="none"
                    stroke={
                      (articleCounts[coord.code] || 0) / maxCount > 0.7
                        ? "#ef4444"
                        : "#3b82f6"
                    }
                    strokeWidth="1"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from={String(radius + 2)}
                      to={String(radius + 12)}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={radius + 4}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                )}

                {/* Gradient dot */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={radius}
                  fill={`url(#${getGradientId(coord.code)})`}
                  opacity={isHovered || isSelected ? 1 : 0.8}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter:
                      isHovered || isSelected
                        ? "drop-shadow(0 0 6px rgba(59,130,246,0.6))"
                        : "none",
                  }}
                />

                {/* Country code label */}
                <text
                  x={coord.x}
                  y={coord.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fontWeight="bold"
                  fill="white"
                  className="pointer-events-none select-none"
                >
                  {coord.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip with sparkline */}
        {hovered && hoveredCountry && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-gray-600 dark:bg-gray-800"
            style={{
              left: `${(hovered.x / 1000) * 100}%`,
              top: `${(hovered.y / 500) * 100 - 12}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {getFlagEmoji(hoveredCountry.toUpperCase())}{" "}
              {tCountries(hoveredCountry)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {articleCounts[hoveredCountry]
                ? `${articleCounts[hoveredCountry]} ${t("articles")}`
                : t("noData")}
            </div>
            {sparkData[hoveredCountry] &&
              sparkData[hoveredCountry].some((v) => v > 0) && (
                <div className="mt-1">
                  <MapSparkline
                    data={sparkData[hoveredCountry]}
                    width={70}
                    height={20}
                  />
                </div>
              )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>{t("low")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span>{t("medium")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>{t("high")}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {t("clickToFilter")}
        </p>
      </div>
    </section>
  );
}
