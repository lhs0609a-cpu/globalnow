"use client";

import { useTranslations } from "next-intl";
import type { Category } from "@/types/news";

const CATEGORIES: (Category | "all")[] = [
  "all",
  "general",
  "business",
  "technology",
  "sports",
  "science",
  "health",
  "entertainment",
];

interface MapCategoryFilterProps {
  selected: Category | "all";
  onChange: (category: Category | "all") => void;
}

export default function MapCategoryFilter({
  selected,
  onChange,
}: MapCategoryFilterProps) {
  const t = useTranslations("Categories");
  const tMap = useTranslations("Map");

  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            selected === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {cat === "all" ? tMap("allCategories") : t(cat)}
        </button>
      ))}
    </div>
  );
}
