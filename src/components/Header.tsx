"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import SearchBar from "./SearchBar";
import DarkModeToggle from "./DarkModeToggle";
import CountrySelector from "./CountrySelector";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import AlertBell from "./AlertBell";
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
  const tNav = useTranslations("Nav");
  const pathname = usePathname();

  const navLinks = [
    { href: "/perspectives" as const, label: tNav("perspectives") },
    { href: "/timeline" as const, label: tNav("timeline") },
    { href: "/quiz" as const, label: tNav("quiz") },
    { href: "/collections" as const, label: tNav("collections") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Global
                <span className="text-blue-600 dark:text-blue-400">Now</span>
              </h1>
            </Link>
            <nav className="hidden items-center gap-1 text-sm lg:flex" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-md px-2 py-1 transition-colors ${
                      isActive
                        ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <AlertBell />
            <CountrySelector selected={country} onChange={onCountryChange} />
            <LanguageSwitcher />
            <DarkModeToggle />
            <UserMenu />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar onSearch={onSearch} initialQuery={searchQuery} />
          <div className="hidden items-center gap-2 sm:flex">
            <AlertBell />
            <CountrySelector selected={country} onChange={onCountryChange} />
            <LanguageSwitcher />
            <DarkModeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-4 py-1.5 sm:hidden dark:border-gray-800" role="navigation" aria-label="Mobile navigation">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
