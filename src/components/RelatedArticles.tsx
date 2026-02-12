"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Article } from "@/types/news";
import { fetchNews } from "@/lib/api";
import NewsCard from "./NewsCard";

interface RelatedArticlesProps {
  currentArticle: Article;
}

export default function RelatedArticles({
  currentArticle,
}: RelatedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Article");

  useEffect(() => {
    const keywords = currentArticle.title
      .replace(/[^\w\s\u3131-\uD79D]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 3)
      .join(" ");

    if (!keywords) {
      setLoading(false);
      return;
    }

    fetchNews({ q: keywords, pageSize: 4 })
      .then((data) => {
        const filtered = data.articles
          .filter(
            (a) =>
              a.title !== "[Removed]" && a.url !== currentArticle.url
          )
          .slice(0, 3);
        setArticles(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentArticle]);

  if (loading) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          {t("relatedArticles")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
        {t("relatedArticles")}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {articles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>
    </div>
  );
}
