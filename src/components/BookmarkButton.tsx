"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import type { Article } from "@/types/news";

interface BookmarkButtonProps {
  article: Article;
}

export default function BookmarkButton({ article }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations("Accessibility");

  const bookmarked = isBookmarked(article);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleBookmark(article);
    showToast(
      bookmarked ? t("removeBookmark") : t("addBookmark"),
      "success"
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-full p-1.5 transition-colors ${
        bookmarked
          ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
          : "bg-white/80 text-gray-400 hover:text-yellow-500 dark:bg-gray-800/80 dark:text-gray-500 dark:hover:text-yellow-400"
      }`}
      aria-label={bookmarked ? t("removeBookmark") : t("addBookmark")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={bookmarked ? 0 : 1.5}
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
    </button>
  );
}
