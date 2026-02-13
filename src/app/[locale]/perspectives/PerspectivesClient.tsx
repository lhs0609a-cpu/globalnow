"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Article, CountryCode } from "@/types/news";
import { COUNTRIES } from "@/data/countries";
import { fetchPerspectives } from "@/lib/api";
import { getCountryBySource } from "@/lib/source-country-map";
import { Link } from "@/i18n/navigation";

function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export default function PerspectivesClient() {
  const [query, setQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<CountryCode[]>([
    "us",
    "kr",
    "cn",
    "gb",
  ]);
  const [results, setResults] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const t = useTranslations("Perspectives");
  const tCountries = useTranslations("Countries");
  const tNav = useTranslations("Nav");

  const toggleCountry = (code: CountryCode) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const articles = await fetchPerspectives(query.trim());

      // Classify articles by country using source-country-map
      const grouped: Record<string, Article[]> = {};
      for (const article of articles) {
        const country = getCountryBySource(
          article.source.name,
          article.url
        );
        if (country) {
          if (!grouped[country]) grouped[country] = [];
          if (grouped[country].length < 5) {
            grouped[country].push(article);
          }
        }
      }

      setResults(grouped);
    } catch {
      setResults({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Simple header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Global
              <span className="text-blue-600 dark:text-blue-400">Now</span>
            </h1>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {tNav("home")}
            </Link>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {tNav("perspectives")}
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Title */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("description")}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("searchPlaceholder")}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? t("searching") : t("compare")}
          </button>
        </div>

        {/* Country chips */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("selectCountries")}
          </p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(({ code, flag }) => (
              <button
                key={code}
                onClick={() => toggleCountry(code as CountryCode)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedCountries.includes(code as CountryCode)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                }`}
              >
                {getFlagEmoji(flag)} {tCountries(code)}
              </button>
            ))}
          </div>
        </div>

        {/* Results columns */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {t("searching")}
            </div>
          </div>
        )}

        {searched && !loading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedCountries.map((countryCode) => {
              const countryArticles = results[countryCode] || [];
              return (
                <div
                  key={countryCode}
                  className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
                    {getFlagEmoji(countryCode.toUpperCase())}{" "}
                    {tCountries(countryCode)} {t("mediaReports")}
                  </h3>

                  {countryArticles.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400 dark:text-gray-500">
                      {t("noArticlesForCountry")}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {countryArticles.map((article, i) => (
                        <a
                          key={i}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                        >
                          <p className="text-sm font-medium leading-snug text-gray-900 dark:text-gray-100">
                            {article.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {article.source.name} ·{" "}
                            {new Date(
                              article.publishedAt
                            ).toLocaleDateString()}
                          </p>
                          {article.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                              {article.description}
                            </p>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {searched && !loading && Object.keys(results).length === 0 && (
          <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("noResults")}
          </p>
        )}
      </main>
    </div>
  );
}
