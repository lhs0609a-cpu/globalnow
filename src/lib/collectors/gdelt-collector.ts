export type GDELTSentiment = {
  country: string;
  avgTone: number;
  articleCount: number;
  themes: string[];
};

export type GDELTCountrySentiment = {
  country: string;
  sentiment: number;       // normalized -1 to 1
  topTopic: string;
  articleCount: number;
};

/** Country code to query topic mapping */
const COUNTRY_QUERIES: { code: string; query: string; topics: string[] }[] = [
  { code: 'US', query: 'United States', topics: ['AI', 'Economy', 'Politics', 'Tech'] },
  { code: 'UK', query: 'United Kingdom', topics: ['Elections', 'Economy', 'Brexit', 'Finance'] },
  { code: 'CN', query: 'China', topics: ['Economy', 'Trade', 'Tech', 'Military'] },
  { code: 'JP', query: 'Japan', topics: ['Semiconductors', 'Economy', 'Tech', 'Trade'] },
  { code: 'DE', query: 'Germany', topics: ['Energy', 'Economy', 'Auto', 'EU'] },
  { code: 'KR', query: 'South Korea', topics: ['Tech', 'Semiconductors', 'Economy', 'K-Culture'] },
  { code: 'FR', query: 'France', topics: ['Politics', 'Economy', 'EU', 'Energy'] },
  { code: 'IN', query: 'India', topics: ['Tech', 'Economy', 'Trade', 'AI'] },
  { code: 'BR', query: 'Brazil', topics: ['Economy', 'Climate', 'Trade', 'Agriculture'] },
  { code: 'AU', query: 'Australia', topics: ['Mining', 'Climate', 'Trade', 'China'] },
];

/** Parse GDELT article list response and extract tone information */
function parseGDELTArticles(data: Record<string, unknown>): { avgTone: number; count: number; topTheme: string } {
  const articles = (data as { articles?: Array<Record<string, unknown>> })?.articles;
  if (!Array.isArray(articles) || articles.length === 0) {
    return { avgTone: 0, count: 0, topTheme: '' };
  }

  let totalTone = 0;
  const themeCounts: Record<string, number> = {};

  for (const article of articles) {
    const tone = typeof article.tone === 'number' ? article.tone :
      typeof article.tone === 'string' ? parseFloat(article.tone) : 0;
    totalTone += isNaN(tone) ? 0 : tone;

    // Count themes/topics
    const title = ((article.title as string) || '').toLowerCase();
    const seenThemes = (article.seendate as string) || '';
    const domain = (article.domain as string) || '';
    // Use simple keyword extraction from title
    const keywords = ['ai', 'economy', 'trade', 'tech', 'climate', 'election', 'military', 'energy', 'semiconductor'];
    for (const kw of keywords) {
      if (title.includes(kw) || seenThemes.includes(kw) || domain.includes(kw)) {
        themeCounts[kw] = (themeCounts[kw] || 0) + 1;
      }
    }
  }

  const avgTone = articles.length > 0 ? totalTone / articles.length : 0;
  const topTheme = Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General';

  return { avgTone, count: articles.length, topTheme: topTheme.charAt(0).toUpperCase() + topTheme.slice(1) };
}

/** Collect sentiment data for a single country from GDELT */
async function collectCountrySentiment(countryQuery: string): Promise<{ avgTone: number; count: number; topTheme: string }> {
  try {
    const query = encodeURIComponent(countryQuery);
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=ArtList&format=json&maxrecords=50&timespan=24h&sort=DateDesc`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'GLOBALNOW/1.0' },
    });

    if (!res.ok) return { avgTone: 0, count: 0, topTheme: '' };

    const data = await res.json();
    return parseGDELTArticles(data as Record<string, unknown>);
  } catch {
    return { avgTone: 0, count: 0, topTheme: '' };
  }
}

/** Wait for a given number of milliseconds */
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Collect GDELT sentiment for all tracked countries (sequential to respect rate limit) */
export async function collectGDELTSentiment(): Promise<GDELTSentiment[]> {
  try {
    const results: GDELTSentiment[] = [];

    // GDELT requires ~5s between requests, so process sequentially
    // Limit to first 5 countries to keep total time reasonable (~25s)
    const countriesToQuery = COUNTRY_QUERIES.slice(0, 5);

    for (let i = 0; i < countriesToQuery.length; i++) {
      const c = countriesToQuery[i];

      if (i > 0) await wait(5500); // Respect GDELT 5s rate limit

      try {
        const result = await collectCountrySentiment(c.query);
        if (result.count > 0) {
          results.push({
            country: c.code,
            avgTone: result.avgTone,
            articleCount: result.count,
            themes: result.topTheme ? [result.topTheme] : c.topics.slice(0, 2),
          });
        }
      } catch {
        // Skip failed countries
      }
    }

    return results;
  } catch (error) {
    console.error('Failed to collect GDELT data:', error);
    return [];
  }
}

/** Collect and return country-level sentiment map data */
export async function collectSentimentMap(): Promise<GDELTCountrySentiment[]> {
  const raw = await collectGDELTSentiment();

  if (raw.length === 0) return [];

  return raw.map(r => ({
    country: r.country,
    // Normalize GDELT tone (typically -10 to 10) to -1 to 1 range
    sentiment: Math.max(-1, Math.min(1, r.avgTone / 10)),
    topTopic: r.themes[0] || 'General',
    articleCount: r.articleCount,
  }));
}
