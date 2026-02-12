"use client";

import SearchBar from "./SearchBar";
import DarkModeToggle from "./DarkModeToggle";
import CountrySelector from "./CountrySelector";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import type { CountryCode } from "@/types/news";
import { Link } from "@/i18n/navigation";

interface HeaderProps {
  country: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function Header({
  country,
  onCountryChange,
  onSearch,
  searchQuery,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Global
              <span className="text-blue-600 dark:text-blue-400">Now</span>
            </h1>
          </Link>
          <div className="flex items-center gap-2 sm:hidden">
            <CountrySelector selected={country} onChange={onCountryChange} />
            <LanguageSwitcher />
            <DarkModeToggle />
            <UserMenu />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar onSearch={onSearch} initialQuery={searchQuery} />
          <div className="hidden items-center gap-2 sm:flex">
            <CountrySelector selected={country} onChange={onCountryChange} />
            <LanguageSwitcher />
            <DarkModeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
