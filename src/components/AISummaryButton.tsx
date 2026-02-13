"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { callAI } from "@/lib/api";

interface AISummaryButtonProps {
  text: string;
}

export default function AISummaryButton({ text }: AISummaryButtonProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const t = useTranslations("Article");
  const locale = useLocale();

  const handleClick = async () => {
    if (summary) {
      setSummary(null);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const result = await callAI("summarize", text, locale);
      setSummary(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 disabled:opacity-50 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
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
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
          />
        </svg>
        {loading ? t("aiLoading") : t("aiSummary")}
      </button>
      {summary && (
        <div className="mt-3 rounded-lg border border-purple-200 bg-purple-50 p-3 text-sm leading-relaxed text-gray-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-gray-300">
          {summary}
        </div>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-500">{t("aiError")}</p>
      )}
    </div>
  );
}
