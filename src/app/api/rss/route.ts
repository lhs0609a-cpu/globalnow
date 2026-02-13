import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/api-security";
import {
  validateCategory,
  validateCountry,
  validatePage,
  validatePageSize,
  validateQuery,
} from "@/lib/api-validation";
import { parseRSSXML } from "@/lib/rss-parser";
import { getFeedsByCountry, getFeedsByCountryAndCategory, RSS_FEEDS } from "@/data/rss-feeds";
import type { Article, CountryCode, Category } from "@/types/news";

// In-memory cache: key -> { articles, timestamp }
const cache = new Map<string, { articles: Article[]; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function fetchFeed(url: string, name: string): Promise<Article[]> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "GlobalNow/1.0 RSS Reader" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return [];
    const xml = await response.text();
    return parseRSSXML(xml, name);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const blocked = applyRateLimit(request, "standard");
  if (blocked) return blocked;

  const { searchParams } = new URL(request.url);

  // Validate inputs
  const countryResult = validateCountry(searchParams.get("country"));
  const catResult = validateCategory(searchParams.get("category"));
  const pageSizeResult = validatePageSize(searchParams.get("pageSize"));
  const pageResult = validatePage(searchParams.get("page"));
  const queryResult = validateQuery(searchParams.get("q"));

  const errors = [countryResult, catResult, pageSizeResult, pageResult, queryResult]
    .filter((r) => !r.valid)
    .map((r) => r.error);
  if (errors.length > 0) {
    return NextResponse.json(
      { status: "error", message: errors.join("; ") },
      { status: 400 }
    );
  }

  const country = countryResult.value as CountryCode | null;
  const category = catResult.value as Category | null;
  const q = queryResult.value;
  const pageSize = pageSizeResult.value;
  const page = pageResult.value;

  const cacheKey = `${country || "all"}_${category || "general"}_${q}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    const start = (page - 1) * pageSize;
    const paged = cached.articles.slice(start, start + pageSize);
    return NextResponse.json({
      status: "ok",
      totalResults: cached.articles.length,
      articles: paged,
      source: "rss-cache",
    });
  }

  // Determine which feeds to fetch
  let feeds;
  if (country && category) {
    feeds = getFeedsByCountryAndCategory(country, category);
  } else if (country) {
    feeds = getFeedsByCountry(country);
  } else {
    // Default: get a variety
    feeds = RSS_FEEDS.slice(0, 10);
  }

  // Fetch all feeds in parallel
  const results = await Promise.all(
    feeds.map((f) => fetchFeed(f.url, f.name))
  );
  let articles = results.flat();

  // Filter by search query
  if (q) {
    const qLower = q.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(qLower) ||
        (a.description && a.description.toLowerCase().includes(qLower))
    );
  }

  // Sort by date descending
  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Deduplicate by title
  const seen = new Set<string>();
  articles = articles.filter((a) => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Cache
  cache.set(cacheKey, { articles, timestamp: Date.now() });

  // Clean old cache entries
  if (cache.size > 200) {
    const now = Date.now();
    for (const [k, v] of cache) {
      if (now - v.timestamp > CACHE_TTL) cache.delete(k);
    }
  }

  const start = (page - 1) * pageSize;
  const paged = articles.slice(start, start + pageSize);

  return NextResponse.json({
    status: "ok",
    totalResults: articles.length,
    articles: paged,
    source: "rss",
  });
}
