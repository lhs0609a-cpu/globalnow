import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/api-security";
import { validateQuery } from "@/lib/api-validation";

const NEWS_API_BASE = "https://newsapi.org/v2";
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const cache = new Map<
  string,
  { articles: Article[]; cachedAt: number }
>();

interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export async function GET(request: NextRequest) {
  const blocked = applyRateLimit(request, "standard");
  if (blocked) return blocked;

  const apiKey = process.env.NEWS_API_KEY;
  const { searchParams } = new URL(request.url);
  const qResult = validateQuery(searchParams.get("q"));

  if (!qResult.value || qResult.value.length === 0) {
    return NextResponse.json(
      { error: "Missing query parameter 'q'" },
      { status: 400 }
    );
  }

  if (!qResult.valid) {
    return NextResponse.json(
      { error: qResult.error },
      { status: 400 }
    );
  }

  const query = qResult.value.toLowerCase();

  // Check cache
  const cached = cache.get(query);
  if (cached && Date.now() - cached.cachedAt < CACHE_DURATION_MS) {
    return NextResponse.json({ articles: cached.articles });
  }

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return NextResponse.json({ articles: [] });
  }

  try {
    const params = new URLSearchParams({
      q: qResult.value,
      sortBy: "relevancy",
      pageSize: "100",
      language: "en",
    });

    const response = await fetch(
      `${NEWS_API_BASE}/everything?${params.toString()}`,
      { headers: { "X-Api-Key": apiKey } }
    );
    const data = await response.json();

    const articles: Article[] =
      data.status === "ok"
        ? data.articles.filter(
            (a: Article) => a.title && a.title !== "[Removed]"
          )
        : [];

    // Cache the result
    cache.set(query, { articles, cachedAt: Date.now() });

    // Clean old cache entries
    if (cache.size > 100) {
      const now = Date.now();
      for (const [k, v] of cache) {
        if (now - v.cachedAt > CACHE_DURATION_MS) cache.delete(k);
      }
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Perspectives API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch perspectives" },
      { status: 500 }
    );
  }
}
