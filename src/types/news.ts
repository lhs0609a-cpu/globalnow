export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export type Category =
  | "general"
  | "business"
  | "technology"
  | "sports"
  | "science"
  | "health"
  | "entertainment";

export type CountryCode = "kr" | "us" | "jp" | "gb" | "fr" | "de";

export interface NewsParams {
  category?: Category;
  country?: CountryCode;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface ExchangeRateChange {
  currency: string;
  rate: number;
  previousRate: number;
  change: number;
  changePercent: number;
}

export interface TrendingTopic {
  keyword: string;
  count: number;
  category: string;
}

export interface StockIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  changePercent: number;
}

export interface FearGreedData {
  value: number;
  classification: string;
  timestamp: string;
}

export interface NewspaperHeadline {
  title: string;
  url: string;
  publishedAt: string;
}

export interface NewspaperWithHeadlines {
  id: string;
  name: string;
  nameEn: string;
  url: string;
  domain: string;
  headlines: NewspaperHeadline[];
}

export interface NewspaperResponse {
  country: CountryCode;
  newspapers: NewspaperWithHeadlines[];
  cachedAt: string;
}
