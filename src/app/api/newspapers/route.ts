import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/api-security";
import { validateCountry } from "@/lib/api-validation";
import { NEWSPAPERS } from "@/data/newspapers";
import { getFeedsByCountry } from "@/data/rss-feeds";
import { parseRSSXML } from "@/lib/rss-parser";
import type { CountryCode, NewspaperWithHeadlines } from "@/types/news";

const NEWS_API_BASE = "https://newsapi.org/v2";
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const cache = new Map<
  string,
  { data: NewspaperWithHeadlines[]; cachedAt: string }
>();

async function getRSSHeadlines(country: CountryCode) {
  const feeds = getFeedsByCountry(country);
  const headlines: { title: string; url: string; publishedAt: string; source: string }[] = [];
  const results = await Promise.all(
    feeds.slice(0, 3).map(async (f) => {
      try {
        const res = await fetch(f.url, {
          headers: { "User-Agent": "GlobalNow/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return parseRSSXML(xml, f.name).slice(0, 5);
      } catch {
        return [];
      }
    })
  );
  for (const articles of results) {
    for (const a of articles) {
      headlines.push({ title: a.title, url: a.url, publishedAt: a.publishedAt, source: a.source.name });
    }
  }
  return headlines;
}

export async function GET(request: NextRequest) {
  const blocked = applyRateLimit(request, "standard");
  if (blocked) return blocked;

  const apiKey = process.env.NEWS_API_KEY;
  const { searchParams } = new URL(request.url);
  const countryParam = searchParams.get("country");

  if (!countryParam) {
    return NextResponse.json(
      { error: "Missing country parameter" },
      { status: 400 }
    );
  }

  const countryResult = validateCountry(countryParam);
  if (!countryResult.valid) {
    return NextResponse.json(
      { error: countryResult.error },
      { status: 400 }
    );
  }

  const country = countryResult.value as CountryCode;

  const newspaperDefs = NEWSPAPERS[country];

  // Check cache
  const cached = cache.get(country);
  if (cached) {
    const cacheAge = Date.now() - new Date(cached.cachedAt).getTime();
    if (cacheAge < CACHE_DURATION_MS) {
      return NextResponse.json({
        country,
        newspapers: cached.data,
        cachedAt: cached.cachedAt,
      });
    }
  }

  // If no API key, use RSS feeds to populate headlines
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    const rssHeadlines = await getRSSHeadlines(country);
    const newspapers: NewspaperWithHeadlines[] = newspaperDefs.map((def) => {
      // Try matching RSS headlines to newspaper by source name or domain
      const matched = rssHeadlines
        .filter((h) =>
          def.sourceNames.some(
            (sn) => h.source.toLowerCase().includes(sn.toLowerCase()) ||
              sn.toLowerCase().includes(h.source.toLowerCase())
          )
        )
        .slice(0, 2)
        .map((h) => ({ title: h.title, url: h.url, publishedAt: h.publishedAt }));

      // If no direct match, assign general headlines round-robin
      const headlines = matched.length > 0 ? matched : [];

      return {
        id: def.id,
        name: def.name,
        nameEn: def.nameEn,
        url: def.url,
        domain: def.domain,
        headlines,
      };
    });

    // If most newspapers have no headlines, distribute RSS headlines
    const emptyCount = newspapers.filter((n) => n.headlines.length === 0).length;
    if (emptyCount > 3 && rssHeadlines.length > 0) {
      let idx = 0;
      for (const np of newspapers) {
        if (np.headlines.length === 0 && idx < rssHeadlines.length) {
          np.headlines = [
            { title: rssHeadlines[idx].title, url: rssHeadlines[idx].url, publishedAt: rssHeadlines[idx].publishedAt },
          ];
          idx++;
        }
      }
    }

    const cachedAt = new Date().toISOString();
    cache.set(country, { data: newspapers, cachedAt });
    return NextResponse.json({ country, newspapers, cachedAt });
  }

  try {
    const params = new URLSearchParams({
      country,
      pageSize: "100",
    });
    const response = await fetch(
      `${NEWS_API_BASE}/top-headlines?${params.toString()}`,
      { headers: { "X-Api-Key": apiKey } }
    );
    const data = await response.json();

    const articles = data.status === "ok" ? data.articles : [];

    // Build a map from source name -> articles
    const sourceArticleMap = new Map<string, typeof articles>();
    for (const article of articles) {
      const name = article.source?.name;
      if (!name) continue;
      if (!sourceArticleMap.has(name)) {
        sourceArticleMap.set(name, []);
      }
      sourceArticleMap.get(name)!.push(article);
    }

    const newspapers: NewspaperWithHeadlines[] = newspaperDefs.map((def) => {
      // Find matching articles by checking all possible source names
      const matchedArticles: typeof articles = [];
      for (const sourceName of def.sourceNames) {
        const found = sourceArticleMap.get(sourceName);
        if (found) {
          matchedArticles.push(...found);
        }
      }

      // Take top 2 headlines
      const headlines = matchedArticles.slice(0, 2).map((a: { title: string; url: string; publishedAt: string }) => ({
        title: a.title,
        url: a.url,
        publishedAt: a.publishedAt,
      }));

      return {
        id: def.id,
        name: def.name,
        nameEn: def.nameEn,
        url: def.url,
        domain: def.domain,
        headlines,
      };
    });

    const cachedAt = new Date().toISOString();
    cache.set(country, { data: newspapers, cachedAt });

    return NextResponse.json({ country, newspapers, cachedAt });
  } catch {
    // Graceful degradation: return newspapers without headlines
    const newspapers: NewspaperWithHeadlines[] = newspaperDefs.map((def) => ({
      id: def.id,
      name: def.name,
      nameEn: def.nameEn,
      url: def.url,
      domain: def.domain,
      headlines: [],
    }));
    return NextResponse.json({
      country,
      newspapers,
      cachedAt: new Date().toISOString(),
    });
  }
}
