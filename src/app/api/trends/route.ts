import { NextResponse } from "next/server";

const NEWS_API_BASE = "https://newsapi.org/v2";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const CATEGORIES = ["technology", "business", "science"];

let cache: { data: unknown; timestamp: number } | null = null;

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return NextResponse.json(
      { error: "NEWS_API_KEY is not configured" },
      { status: 500 }
    );
  }

  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  try {
    const requests = CATEGORIES.map((category) =>
      fetch(
        `${NEWS_API_BASE}/top-headlines?category=${category}&language=en&pageSize=10&apiKey=${apiKey}`,
        { next: { revalidate: 600 } }
      ).then((r) => r.json())
    );

    const results = await Promise.all(requests);

    const wordCounts: Record<string, { count: number; category: string }> = {};

    // Common words to exclude
    const stopWords = new Set([
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
      "of", "with", "by", "from", "is", "it", "as", "be", "was", "are",
      "been", "being", "have", "has", "had", "do", "does", "did", "will",
      "would", "could", "should", "may", "might", "can", "this", "that",
      "these", "those", "not", "no", "its", "his", "her", "their", "our",
      "your", "my", "what", "which", "who", "whom", "how", "when", "where",
      "why", "all", "each", "every", "both", "few", "more", "most", "other",
      "some", "such", "than", "too", "very", "just", "about", "above",
      "after", "again", "over", "under", "new", "old", "says", "said",
      "also", "back", "even", "still", "way", "take", "come", "make",
      "like", "get", "got", "into", "out", "up", "one", "two", "first",
      "last", "long", "great", "little", "own", "only", "year", "years",
      "removed",
    ]);

    results.forEach((result, i) => {
      if (result.status !== "ok") return;
      const category = CATEGORIES[i];

      result.articles?.forEach(
        (article: { title?: string; description?: string }) => {
          const text = `${article.title || ""} ${article.description || ""}`;
          const words = text
            .toLowerCase()
            .replace(/[^a-z0-9\s\u3131-\uD79D\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, " ")
            .split(/\s+/)
            .filter((w) => w.length > 3 && !stopWords.has(w));

          const seen = new Set<string>();
          words.forEach((word) => {
            if (seen.has(word)) return;
            seen.add(word);

            if (!wordCounts[word]) {
              wordCounts[word] = { count: 0, category };
            }
            wordCounts[word].count++;
          });
        }
      );
    });

    const trends = Object.entries(wordCounts)
      .filter(([, v]) => v.count >= 2)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 15)
      .map(([keyword, v]) => ({
        keyword,
        count: v.count,
        category: v.category,
      }));

    cache = { data: trends, timestamp: Date.now() };

    return NextResponse.json(trends);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
