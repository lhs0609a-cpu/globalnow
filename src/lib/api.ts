import type {
  NewsResponse,
  NewsParams,
  ExchangeRateChange,
  TrendingTopic,
  StockIndex,
  CryptoPrice,
  FearGreedData,
  NewspaperResponse,
  CountryCode,
  Article,
} from "@/types/news";

export async function fetchNews(
  params: NewsParams = {}
): Promise<NewsResponse> {
  const searchParams = new URLSearchParams();

  if (params.category) searchParams.set("category", params.category);
  if (params.country) searchParams.set("country", params.country);
  if (params.q) searchParams.set("q", params.q);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));

  const response = await fetch(`/api/news?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch news");
  }

  return response.json();
}

export async function fetchExchangeRates(): Promise<ExchangeRateChange[]> {
  const response = await fetch("/api/exchange");

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  return response.json();
}

export async function fetchTrends(): Promise<TrendingTopic[]> {
  const response = await fetch("/api/trends");

  if (!response.ok) {
    throw new Error("Failed to fetch trends");
  }

  return response.json();
}

export async function fetchStockIndices(): Promise<StockIndex[]> {
  const response = await fetch("/api/stocks");

  if (!response.ok) {
    throw new Error("Failed to fetch stock indices");
  }

  return response.json();
}

export async function fetchCrypto(): Promise<CryptoPrice[]> {
  const response = await fetch("/api/crypto");

  if (!response.ok) {
    throw new Error("Failed to fetch crypto prices");
  }

  return response.json();
}

export async function fetchFearGreed(): Promise<FearGreedData> {
  const response = await fetch("/api/fear-greed");

  if (!response.ok) {
    throw new Error("Failed to fetch fear & greed index");
  }

  return response.json();
}

export async function fetchNewspapers(
  country: CountryCode
): Promise<NewspaperResponse> {
  const response = await fetch(`/api/newspapers?country=${country}`);

  if (!response.ok) {
    throw new Error("Failed to fetch newspapers");
  }

  return response.json();
}

// --- Phase 2: AI helpers ---

export async function callAI(
  action: "summarize" | "translate",
  text: string,
  targetLang: string
): Promise<string> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify({ action, text, targetLang }),
  });

  if (!response.ok) {
    throw new Error("AI request failed");
  }

  const data = await response.json();
  return data.result;
}

// --- Phase 3: Article count store (client-side, in-memory) ---

const articleCountStore: Record<string, number> = {};

export function setArticleCount(country: string, count: number): void {
  articleCountStore[country] = count;
}

export function getArticleCounts(): Record<string, number> {
  return articleCountStore;
}

// Category-level article count store: "country_category" -> count
const articleCountByCategoryStore: Record<string, Record<string, number>> = {};

export function setArticleCountByCategory(
  country: string,
  category: string,
  count: number
): void {
  if (!articleCountByCategoryStore[country]) {
    articleCountByCategoryStore[country] = {};
  }
  articleCountByCategoryStore[country][category] = count;
}

export function getArticleCountsByCategory(): Record<string, Record<string, number>> {
  return articleCountByCategoryStore;
}

// --- Stock Quote (for correlation) ---

export async function fetchStockQuote(
  symbol: string
): Promise<import("@/types/news").StockQuote> {
  const response = await fetch(
    `/api/stock-quote?symbol=${encodeURIComponent(symbol)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stock quote");
  }
  return response.json();
}

// --- AI Quiz ---

export async function callAIQuiz(
  headlines: string[]
): Promise<import("@/types/news").QuizQuestion[]> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify({
      action: "quiz",
      text: headlines.join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error("Quiz generation failed");
  }

  const data = await response.json();
  return data.result;
}

// --- Phase 4: Perspectives ---

export async function fetchPerspectives(keyword: string): Promise<Article[]> {
  const response = await fetch(
    `/api/perspectives?q=${encodeURIComponent(keyword)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch perspectives");
  }

  const data = await response.json();
  return data.articles;
}
