"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Article, Category, CountryCode } from "@/types/news";
import { fetchNews } from "@/lib/api";
import NewsCard from "./NewsCard";
import { SkeletonGrid } from "./Skeleton";

interface NewsListProps {
  category: Category;
  country: CountryCode;
  searchQuery: string;
}

export default function NewsList({
  category,
  country,
  searchQuery,
}: NewsListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const t = useTranslations("News");

  const loadNews = useCallback(
    async (pageNum: number, append: boolean = false) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const data = await fetchNews({
          category: searchQuery ? undefined : category,
          country: searchQuery ? undefined : country,
          q: searchQuery || undefined,
          page: pageNum,
          pageSize: 12,
        });

        const filtered = data.articles.filter((a) => a.title !== "[Removed]");

        if (append) {
          setArticles((prev) => [...prev, ...filtered]);
        } else {
          setArticles(filtered);
        }
        setTotalResults(data.totalResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error"));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, country, searchQuery, t]
  );

  useEffect(() => {
    setPage(1);
    loadNews(1);
  }, [loadNews]);

  const loaderRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && !loading && articles.length < totalResults) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadNews(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [page, loadingMore, loading, articles.length, totalResults, loadNews]);

  if (loading) {
    return <SkeletonGrid />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mb-3 h-10 w-10 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
        <p className="text-sm font-medium text-red-700 dark:text-red-400">
          {error}
        </p>
        <button
          onClick={() => loadNews(1)}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mb-3 h-10 w-10 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
          />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("noArticles")}
        </p>
      </div>
    );
  }

  const hasMore = articles.length < totalResults;

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>
      {hasMore && (
        <div ref={loaderRef} className="mt-8 flex justify-center py-4">
          {loadingMore && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
              {t("loading")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
