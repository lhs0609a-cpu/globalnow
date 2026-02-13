"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Category, CountryCode } from "@/types/news";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import NewspaperSection from "@/components/NewspaperSection";
import NewsList from "@/components/NewsList";
import Sidebar from "@/components/Sidebar";
import WorldNewsMap from "@/components/WorldNewsMap";
import CorrelationSection from "@/components/CorrelationSection";

const VALID_CATEGORIES: Category[] = [
  "general", "business", "technology", "sports", "science", "health", "entertainment",
];
const VALID_COUNTRIES: CountryCode[] = [
  "kr", "us", "jp", "gb", "fr", "de", "cn", "in", "ae", "sa", "il", "au", "ca", "br", "ru",
];

function updateUrlParams(params: Record<string, string>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value && value !== getDefaultForParam(key)) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  }
  window.history.replaceState({}, "", url.toString());
}

function getDefaultForParam(key: string): string {
  if (key === "country") return "kr";
  if (key === "category") return "general";
  return "";
}

export default function Home() {
  const searchParams = useSearchParams();

  const initCountry = VALID_COUNTRIES.includes(searchParams.get("country") as CountryCode)
    ? (searchParams.get("country") as CountryCode)
    : "kr";
  const initCategory = VALID_CATEGORIES.includes(searchParams.get("category") as Category)
    ? (searchParams.get("category") as Category)
    : "general";
  const initSearch = searchParams.get("q") || "";

  const [category, setCategory] = useState<Category>(initCategory);
  const [country, setCountry] = useState<CountryCode>(initCountry);
  const [searchQuery, setSearchQuery] = useState(initSearch);
  const t = useTranslations("News");

  // Sync state changes to URL
  useEffect(() => {
    updateUrlParams({ country, category, q: searchQuery });
  }, [country, category, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((cat: Category) => {
    setCategory(cat);
    setSearchQuery("");
  }, []);

  const handleTrendClick = useCallback((keyword: string) => {
    setSearchQuery(keyword);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header
        country={country}
        onCountryChange={setCountry}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <WorldNewsMap selectedCountry={country} onCountryChange={setCountry} />
        <div className="mb-6">
          <CategoryFilter selected={category} onChange={handleCategoryChange} />
        </div>
        <NewspaperSection country={country} />
        {searchQuery && (
          <>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {t("searchResults", { query: searchQuery })}
            </p>
            <CorrelationSection text={searchQuery} />
          </>
        )}
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 min-w-0">
            <NewsList
              category={category}
              country={country}
              searchQuery={searchQuery}
            />
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <Sidebar onTrendClick={handleTrendClick} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
      {t("copyright", { year: new Date().getFullYear() })}
    </footer>
  );
}
