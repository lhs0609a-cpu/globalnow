import { NEWSPAPERS } from "@/data/newspapers";
import type { CountryCode } from "@/types/news";

// Build a reverse map: source name or domain -> country code
const sourceToCountry = new Map<string, CountryCode>();

for (const [country, papers] of Object.entries(NEWSPAPERS)) {
  for (const paper of papers) {
    // Map by domain
    sourceToCountry.set(paper.domain.toLowerCase(), country as CountryCode);
    // Map by all source names
    for (const name of paper.sourceNames) {
      sourceToCountry.set(name.toLowerCase(), country as CountryCode);
    }
  }
}

export function getCountryBySource(
  sourceName: string,
  sourceUrl?: string
): CountryCode | null {
  // Try matching by source name first
  const byName = sourceToCountry.get(sourceName.toLowerCase());
  if (byName) return byName;

  // Try matching by domain from URL
  if (sourceUrl) {
    try {
      const hostname = new URL(sourceUrl).hostname.replace(/^www\./, "");
      // Try exact match
      const byDomain = sourceToCountry.get(hostname);
      if (byDomain) return byDomain;
      // Try matching parent domain (e.g., "news.bbc.com" -> "bbc.com")
      const parts = hostname.split(".");
      if (parts.length > 2) {
        const parent = parts.slice(-2).join(".");
        const byParent = sourceToCountry.get(parent);
        if (byParent) return byParent;
      }
    } catch {
      // Invalid URL, skip
    }
  }

  return null;
}
