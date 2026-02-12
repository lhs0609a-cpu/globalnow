"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { TrendingTopic } from "@/types/news";
import { fetchTrends } from "@/lib/api";

interface TrendingTopicsProps {
  onTopicClick: (keyword: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  technology:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  business:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  science:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  health:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  sports:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function TrendingTopics({ onTopicClick }: TrendingTopicsProps) {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = useTranslations("Trends");
  const tn = useTranslations("News");

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchTrends()
      .then(setTopics)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
        {t("title")}
      </h3>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-7 animate-pulse rounded-full bg-gray-100 dark:bg-gray-700"
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
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, i) => (
            <button
              key={topic.keyword}
              onClick={() => onTopicClick(topic.keyword)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${
                CATEGORY_COLORS[topic.category] ||
                "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-[10px] font-bold opacity-50">
                {i + 1}
              </span>
              {topic.keyword}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
