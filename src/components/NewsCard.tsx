"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Article } from "@/types/news";
import { Link } from "@/i18n/navigation";
import { cacheArticle, getArticleId } from "@/lib/article-cache";
import BookmarkButton from "./BookmarkButton";
import AddToCollectionButton from "./AddToCollectionButton";
import { useEffect } from "react";

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
  const { title, description, urlToImage, source, publishedAt } = article;
  const [imgError, setImgError] = useState(false);
  const t = useTranslations("Time");

  useEffect(() => {
    if (title !== "[Removed]") {
      cacheArticle(article);
    }
  }, [article, title]);

  if (title === "[Removed]") return null;

  const articleId = getArticleId(article);

  function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return t("justNow");
    if (diffMin < 60) return t("minutesAgo", { minutes: diffMin });
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return t("hoursAgo", { hours: diffHr });
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return t("daysAgo", { days: diffDay });
    return date.toLocaleDateString();
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
      <Link href={`/article/${articleId}`} className="flex flex-col flex-1">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          {urlToImage && !imgError ? (
            <Image
              src={urlToImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-12 w-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
            {title}
          </h3>
          {description && (
            <p className="mb-3 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <span className="font-medium">{source.name}</span>
            <span>{timeAgo(publishedAt)}</span>
          </div>
        </div>
      </Link>
      <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-full bg-black/20 p-0.5 backdrop-blur-sm">
        <AddToCollectionButton article={article} compact />
        <BookmarkButton article={article} />
      </div>
    </div>
  );
}
