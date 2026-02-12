"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Category, CountryCode } from "@/types/news";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import NewspaperSection from "@/components/NewspaperSection";
import NewsList from "@/components/NewsList";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [category, setCategory] = useState<Category>("general");
  const [country, setCountry] = useState<CountryCode>("kr");
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("News");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSearchQuery("");
  };

  const handleTrendClick = (keyword: string) => {
    setSearchQuery(keyword);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header
        country={country}
        onCountryChange={setCountry}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <CategoryFilter selected={category} onChange={handleCategoryChange} />
        </div>
        <NewspaperSection />
        {searchQuery && (
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {t("searchResults", { query: searchQuery })}
          </p>
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
