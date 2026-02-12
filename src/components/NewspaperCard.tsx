"use client";

import { useTranslations } from "next-intl";
import type { NewspaperWithHeadlines } from "@/types/news";

interface NewspaperCardProps {
  newspaper: NewspaperWithHeadlines;
}

export default function NewspaperCard({ newspaper }: NewspaperCardProps) {
  const t = useTranslations("Newspapers");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={`https://www.google.com/s2/favicons?domain=${newspaper.domain}&sz=32`}
            alt=""
            width={20}
            height={20}
            className="shrink-0 rounded"
          />
          <span className="truncate font-semibold text-gray-900 dark:text-gray-100">
            {newspaper.name}
          </span>
        </div>
        <a
          href={newspaper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 ml-2 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
        >
          {t("visit")}
        </a>
      </div>

      {newspaper.headlines.length > 0 ? (
        <ul className="space-y-1.5">
          {newspaper.headlines.map((headline, idx) => (
            <li key={idx}>
              <a
                href={headline.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 line-clamp-1"
              >
                <span className="mr-1 text-gray-400 dark:text-gray-500">•</span>
                {headline.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {t("noHeadlines")}
        </p>
      )}
    </div>
  );
}
