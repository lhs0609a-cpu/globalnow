"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Article } from "@/types/news";
import { getCachedArticle, cacheArticle, decodeArticleId } from "@/lib/article-cache";
import { fetchNews } from "@/lib/api";
import { Link } from "@/i18n/navigation";
import ShareButtons from "./ShareButtons";
import RelatedArticles from "./RelatedArticles";
import BookmarkButton from "./BookmarkButton";

interface ArticleDetailProps {
  articleId: string;
}

export default function ArticleDetail({ articleId }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const t = useTranslations("Article");
  const tn = useTranslations("News");

  useEffect(() => {
    async function loadArticle() {
      // 1. Try sessionStorage cache
      const cached = getCachedArticle(articleId);
      if (cached) {
        setArticle(cached);
        setLoading(false);
        return;
      }

      // 2. Decode the ID to get the original URL
      const decodedUrl = decodeArticleId(articleId);
      if (decodedUrl) {
        // 3. Extract search keywords from URL
        const urlParts = decodedUrl
          .replace(/https?:\/\//, "")
          .split(/[/\-_.]/)
          .filter((w) => w.length > 3 && !/^\d+$/.test(w))
          .slice(0, 3)
          .join(" ");

        if (urlParts) {
          try {
            const data = await fetchNews({ q: urlParts, pageSize: 5 });
            const match = data.articles.find(
              (a) => a.title !== "[Removed]"
            );
            if (match) {
              cacheArticle(match);
              setArticle(match);
              setLoading(false);
              return;
            }
          } catch {
            // Search failed, fall through
          }
        }

        // 4. If no match found, redirect to original URL
        window.location.href = decodedUrl;
        return;
      }

      setLoading(false);
    }

    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-96" />
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
          />
        </svg>
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t("notFound")}
        </h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {tn("error")}
        </p>
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t("goHome")}
        </Link>
      </div>
    );
  }

  const publishedDate = new Date(article.publishedAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        {t("goHome")}
      </Link>

      <article>
        <h1 className="mb-4 text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
          {article.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>
            {t("source")}: <strong>{article.source.name}</strong>
          </span>
          {article.author && (
            <span>
              {t("author")}: {article.author}
            </span>
          )}
          <span>
            {t("publishedAt")}: {publishedDate}
          </span>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <ShareButtons title={article.title} url={article.url} />
          <BookmarkButton article={article} />
        </div>

        {article.urlToImage && !imgError && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl sm:h-96">
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              unoptimized
              priority
              onError={() => setImgError(true)}
            />
          </div>
        )}

        {article.description && (
          <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {article.description}
          </p>
        )}

        {article.content && (
          <div className="mb-8 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {article.content.replace(/\[\+\d+ chars\]/, "")}
          </div>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t("readOriginal")}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </article>

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      <RelatedArticles currentArticle={article} />
    </div>
  );
}
