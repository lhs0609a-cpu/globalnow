"use client";

import { useTranslations } from "next-intl";
import type { CountryCode } from "@/types/news";

const COUNTRIES: { code: CountryCode; flag: string }[] = [
  { code: "kr", flag: "KR" },
  { code: "us", flag: "US" },
  { code: "jp", flag: "JP" },
  { code: "gb", flag: "GB" },
  { code: "fr", flag: "FR" },
  { code: "de", flag: "DE" },
];

function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

interface CountrySelectorProps {
  selected: CountryCode;
  onChange: (country: CountryCode) => void;
}

export default function CountrySelector({
  selected,
  onChange,
}: CountrySelectorProps) {
  const t = useTranslations("Countries");
  const ta = useTranslations("Accessibility");

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value as CountryCode)}
      aria-label={ta("selectCountry")}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
    >
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.code}>
          {getFlagEmoji(c.flag)} {t(c.code)}
        </option>
      ))}
    </select>
  );
}
