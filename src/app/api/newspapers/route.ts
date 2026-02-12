import { NextRequest, NextResponse } from "next/server";
import { NEWSPAPERS } from "@/data/newspapers";
import type { CountryCode, NewspaperWithHeadlines } from "@/types/news";

const NEWS_API_BASE = "https://newsapi.org/v2";
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const cache = new Map<
  string,
  { data: NewspaperWithHeadlines[]; cachedAt: string }
>();

const VALID_COUNTRIES: CountryCode[] = ["kr", "us", "jp", "gb", "fr", "de"];

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEWS_API_KEY;
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") as CountryCode;

  if (!country || !VALID_COUNTRIES.includes(country)) {
    return NextResponse.json(
      { error: "Invalid country code" },
      { status: 400 }
    );
  }

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

  // If no API key, return newspapers without headlines
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
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

  try {
    const params = new URLSearchParams({
      country,
      pageSize: "100",
      apiKey,
    });
    const response = await fetch(
      `${NEWS_API_BASE}/top-headlines?${params.toString()}`
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
