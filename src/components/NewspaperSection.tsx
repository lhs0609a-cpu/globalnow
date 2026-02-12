"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { CountryCode, NewspaperWithHeadlines } from "@/types/news";
import { fetchNewspapers } from "@/lib/api";
import NewspaperCard from "./NewspaperCard";

const COUNTRY_TABS: { code: CountryCode; flag: string }[] = [
  { code: "kr", flag: "🇰🇷" },
  { code: "us", flag: "🇺🇸" },
  { code: "jp", flag: "🇯🇵" },
  { code: "gb", flag: "🇬🇧" },
  { code: "fr", flag: "🇫🇷" },
  { code: "de", flag: "🇩🇪" },
];

export default function NewspaperSection() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("kr");
  const [newspapers, setNewspapers] = useState<NewspaperWithHeadlines[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const t = useTranslations("Newspapers");
  const tCountries = useTranslations("Countries");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchNewspapers(selectedCountry)
      .then((data) => {
        if (!cancelled) {
          setNewspapers(data.newspapers);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCountry, retryKey]);

  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">🗞️</span>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>
      </div>

      {/* Country Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {COUNTRY_TABS.map(({ code, flag }) => (
          <button
            key={code}
            onClick={() => setSelectedCountry(code)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCountry === code
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
            }`}
          >
            {flag} {tCountries(code)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="mb-2 text-sm text-red-600 dark:text-red-400">
            {t("error")}
          </p>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="text-sm font-medium text-red-700 hover:underline dark:text-red-300"
          >
            {t("retry")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newspapers.map((newspaper) => (
            <NewspaperCard key={newspaper.id} newspaper={newspaper} />
          ))}
        </div>
      )}
    </section>
  );
}
