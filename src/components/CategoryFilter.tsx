"use client";

import { useTranslations } from "next-intl";
import type { Category } from "@/types/news";

const CATEGORIES: Category[] = [
  "general",
  "business",
  "technology",
  "sports",
  "science",
  "health",
  "entertainment",
];

interface CategoryFilterProps {
  selected: Category;
  onChange: (category: Category) => void;
}

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  const t = useTranslations("Categories");

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="News categories">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={selected === cat}
          onClick={() => onChange(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === cat
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {t(cat)}
        </button>
      ))}
    </div>
  );
}
