"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { callAI } from "@/lib/api";

interface AITranslateButtonProps {
  text: string;
}

export default function AITranslateButton({ text }: AITranslateButtonProps) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const t = useTranslations("Article");
  const locale = useLocale();

  const handleClick = async () => {
    if (translation) {
      setTranslation(null);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const result = await callAI("translate", text, locale);
      setTranslation(result);
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
        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
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
            d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
          />
        </svg>
        {loading ? t("aiLoading") : t("translate")}
      </button>
      {translation && (
        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-relaxed text-gray-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-gray-300">
          {translation}
        </div>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-500">{t("aiError")}</p>
      )}
    </div>
  );
}
