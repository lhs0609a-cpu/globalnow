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
