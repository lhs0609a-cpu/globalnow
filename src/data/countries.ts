export type Region =
  | "east-asia"
  | "south-asia"
  | "middle-east"
  | "europe"
  | "americas"
  | "oceania";

export interface CountryDef {
  code: string;
  region: Region;
  flag: string;
}

export const COUNTRIES: CountryDef[] = [
  // East Asia
  { code: "kr", region: "east-asia", flag: "KR" },
  { code: "jp", region: "east-asia", flag: "JP" },
  { code: "cn", region: "east-asia", flag: "CN" },
  // South Asia
  { code: "in", region: "south-asia", flag: "IN" },
  // Middle East
  { code: "ae", region: "middle-east", flag: "AE" },
  { code: "sa", region: "middle-east", flag: "SA" },
  { code: "il", region: "middle-east", flag: "IL" },
  // Europe
  { code: "gb", region: "europe", flag: "GB" },
  { code: "fr", region: "europe", flag: "FR" },
  { code: "de", region: "europe", flag: "DE" },
  { code: "ru", region: "europe", flag: "RU" },
  // Americas
  { code: "us", region: "americas", flag: "US" },
  { code: "ca", region: "americas", flag: "CA" },
  { code: "br", region: "americas", flag: "BR" },
  // Oceania
  { code: "au", region: "oceania", flag: "AU" },
];

export const COUNTRY_CODES = COUNTRIES.map((c) => c.code);

export function getCountriesByRegion(region: Region): CountryDef[] {
  return COUNTRIES.filter((c) => c.region === region);
}

export const REGIONS: Region[] = [
  "east-asia",
  "south-asia",
  "middle-east",
  "europe",
  "americas",
  "oceania",
];
