import { NEWS_SOURCES } from '@/lib/constants/sources';
import { MEDIA_RANKINGS, MediaTier, MediaRanking } from '@/lib/constants/media-rankings';
import { NewsSource } from '@/types/news';

export type RankedSource = NewsSource & MediaRanking;

export function getRankedSources(tier?: MediaTier, country?: string): RankedSource[] {
  const ranked: RankedSource[] = [];

  for (const ranking of MEDIA_RANKINGS) {
    const source = NEWS_SOURCES.find(s => s.id === ranking.sourceId);
    if (!source) continue;
    ranked.push({ ...source, ...ranking });
  }

  let filtered = ranked;

  if (tier) {
    filtered = filtered.filter(s => s.tier === tier);
  }
  if (country) {
    filtered = filtered.filter(s => s.country === country);
  }

  filtered.sort((a, b) => a.globalRank - b.globalRank);
  return filtered;
}

export function getAvailableCountries(): { code: string; flag: string; name: string }[] {
  const countrySet = new Map<string, { flag: string; name: string }>();
  for (const source of NEWS_SOURCES) {
    if (!countrySet.has(source.country)) {
      countrySet.set(source.country, { flag: source.countryFlag, name: source.country });
    }
  }
  return Array.from(countrySet.entries()).map(([code, info]) => ({
    code,
    flag: info.flag,
    name: code,
  }));
}
