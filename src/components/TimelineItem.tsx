"use client";

import Image from "next/image";
import { useState } from "react";
import type { Article } from "@/types/news";
import { Link } from "@/i18n/navigation";
import { cacheArticle, getArticleId } from "@/lib/article-cache";

interface TimelineItemProps {
  article: Article;
  side: "left" | "right";
}

export default function TimelineItem({ article, side }: TimelineItemProps) {
  const [imgError, setImgError] = useState(false);
  const articleId = getArticleId(article);

  const handleClick = () => {
    cacheArticle(article);
  };

  const time = new Date(article.publishedAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`relative flex w-full ${
        side === "left" ? "md:justify-start" : "md:justify-end"
      } justify-start`}
    >
      {/* Dot on the line */}
      <div className="absolute left-[11px] top-6 z-10 h-3 w-3 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-900 md:left-1/2 md:-translate-x-1/2" />

      {/* Card */}
      <div
        className={`ml-8 w-full md:ml-0 md:w-[calc(50%-2rem)] ${
          side === "left" ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
        }`}
      >
        <Link
          href={`/article/${articleId}`}
          onClick={handleClick}
          className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex gap-3 p-3">
            {article.urlToImage && !imgError && (
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={article.urlToImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                  onError={() => setImgError(true)}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                {article.title}
              </h3>
              {article.description && (
                <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                  {article.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <span className="font-medium">{article.source.name}</span>
                <span>{time}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
