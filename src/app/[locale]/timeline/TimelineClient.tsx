"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";
import { fetchPerspectives } from "@/lib/api";
import TimelineItem from "@/components/TimelineItem";

function groupByDate(articles: Article[]): Record<string, Article[]> {
  const groups: Record<string, Article[]> = {};
  for (const article of articles) {
    const date = new Date(article.publishedAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(article);
  }
  return groups;
}

export default function TimelineClient() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const t = useTranslations("Timeline");
  const tNav = useTranslations("Nav");

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const results = await fetchPerspectives(query.trim());
      // Sort by date descending
      results.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );
      setArticles(results);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const grouped = groupByDate(articles);
  const dates = Object.keys(grouped);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          {tNav("home")}
        </Link>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {t("title")}
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {t("description")}
      </p>

      {/* Search bar */}
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("searchPlaceholder")}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t("searching") : t("search")}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      )}

      {/* No results */}
      {searched && !loading && articles.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("noResults")}
          </p>
        </div>
      )}

      {/* Timeline */}
      {!loading && articles.length > 0 && (
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 md:left-1/2 md:-translate-x-px" />

          <div className="space-y-4">
            {dates.map((date) => (
              <div key={date}>
                {/* Date pill */}
                <div className="relative mb-4 flex justify-start md:justify-center">
                  <span className="relative z-10 rounded-full bg-blue-100 px-4 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 ml-6 md:ml-0">
                    {date}
                  </span>
                </div>

                {/* Articles for this date */}
                <div className="space-y-3">
                  {grouped[date].map((article, idx) => (
                    <TimelineItem
                      key={`${article.url}-${idx}`}
                      article={article}
                      side={idx % 2 === 0 ? "left" : "right"}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
