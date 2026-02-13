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
import {
  getFeedsByCountry,
  getFeedsByCountryAndCategory,
  RSS_FEEDS,
} from "@/data/rss-feeds";
import type { Article, CountryCode, Category } from "@/types/news";

const NEWS_API_BASE = "https://newsapi.org/v2";

// RSS in-memory cache
const rssCache = new Map<
  string,
  { articles: Article[]; timestamp: number }
>();
const RSS_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function fetchRSSFeed(
  url: string,
  name: string
): Promise<Article[]> {
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

async function getRSSArticles(
  country: string,
  category: string,
  q: string
): Promise<{ articles: Article[]; totalResults: number }> {
  const cacheKey = `${country}_${category}_${q}`;
  const cached = rssCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < RSS_CACHE_TTL) {
    return { articles: cached.articles, totalResults: cached.articles.length };
  }

  let feeds;
  if (country && category) {
    feeds = getFeedsByCountryAndCategory(
      country as CountryCode,
      category as Category
    );
  } else if (country) {
    feeds = getFeedsByCountry(country as CountryCode);
  } else {
    feeds = RSS_FEEDS.slice(0, 10);
  }

  const results = await Promise.all(
    feeds.map((f) => fetchRSSFeed(f.url, f.name))
  );
  let articles = results.flat();

  if (q) {
    const qLower = q.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(qLower) ||
        (a.description && a.description.toLowerCase().includes(qLower))
    );
  }

  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Deduplicate
  const seen = new Set<string>();
  articles = articles.filter((a) => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  rssCache.set(cacheKey, { articles, timestamp: Date.now() });
  if (rssCache.size > 200) {
    const now = Date.now();
    for (const [k, v] of rssCache) {
      if (now - v.timestamp > RSS_CACHE_TTL) rssCache.delete(k);
    }
  }

  return { articles, totalResults: articles.length };
}

export async function GET(request: NextRequest) {
  const blocked = applyRateLimit(request, "standard");
  if (blocked) return blocked;

  const apiKey = process.env.NEWS_API_KEY;
  const { searchParams } = new URL(request.url);

  // Validate inputs
  const catResult = validateCategory(searchParams.get("category"));
  const countryResult = validateCountry(searchParams.get("country"));
  const pageResult = validatePage(searchParams.get("page"));
  const pageSizeResult = validatePageSize(searchParams.get("pageSize"));
  const queryResult = validateQuery(searchParams.get("q"));

  const errors = [catResult, countryResult, pageResult, pageSizeResult, queryResult]
    .filter((r) => !r.valid)
    .map((r) => r.error);
  if (errors.length > 0) {
    return NextResponse.json(
      { status: "error", message: errors.join("; ") },
      { status: 400 }
    );
  }

  const category = catResult.value;
  const country = countryResult.value;
  const q = queryResult.value;
  const page = String(pageResult.value);
  const pageSize = String(pageSizeResult.value);

  // --- RSS Fallback when no API key ---
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    const pageSizeNum = parseInt(pageSize, 10);
    const pageNum = parseInt(page, 10);
    const { articles, totalResults } = await getRSSArticles(
      country,
      category,
      q
    );
    const start = (pageNum - 1) * pageSizeNum;
    const paged = articles.slice(start, start + pageSizeNum);
    return NextResponse.json({
      status: "ok",
      totalResults,
      articles: paged,
    });
  }

  // --- NewsAPI path ---
  try {
    let url: string;

    if (q) {
      const params = new URLSearchParams({
        q,
        page,
        pageSize,
        sortBy: "publishedAt",
      });
      url = `${NEWS_API_BASE}/everything?${params.toString()}`;
    } else {
      const params = new URLSearchParams({
        category,
        country,
        page,
        pageSize,
      });
      url = `${NEWS_API_BASE}/top-headlines?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
      next: { revalidate: 300 },
    });

    const data = await response.json();

    if (data.status === "error") {
      return NextResponse.json(
        { status: "error", message: data.message },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    // If NewsAPI fails, try RSS fallback
    try {
      const pageSizeNum = parseInt(pageSize, 10);
      const pageNum = parseInt(page, 10);
      const { articles, totalResults } = await getRSSArticles(
        country,
        category,
        q
      );
      const start = (pageNum - 1) * pageSizeNum;
      const paged = articles.slice(start, start + pageSizeNum);
      return NextResponse.json({
        status: "ok",
        totalResults,
        articles: paged,
      });
    } catch {
      return NextResponse.json(
        { status: "error", message: "Failed to fetch news" },
        { status: 500 }
      );
    }
  }
}
