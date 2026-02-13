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

export type CountryCode =
  | "kr"
  | "us"
  | "jp"
  | "gb"
  | "fr"
  | "de"
  | "cn"
  | "in"
  | "ae"
  | "sa"
  | "il"
  | "au"
  | "ca"
  | "br"
  | "ru";

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

// --- RSS Feed ---
export interface RSSFeedDef {
  url: string;
  name: string;
  country: CountryCode;
  category: Category;
  language: string;
}

// --- Trend ---
export interface TrendDataPoint {
  date: string;
  counts: Record<string, number>;
}

// --- Quiz ---
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  date: string;
  questions: QuizQuestion[];
  answers: number[];
}

// --- Alert ---
export interface AlertSubscription {
  id: string;
  keyword: string;
  country?: CountryCode;
  enabled: boolean;
  createdAt: string;
}

export interface AlertNotification {
  id: string;
  subscriptionId: string;
  article: { title: string; url: string; source: string; publishedAt: string };
  readAt: string | null;
  createdAt: string;
}

// --- Collection ---
export interface CollectionArticle {
  title: string;
  url: string;
  source: string;
  urlToImage: string | null;
  savedAt: string;
  description?: string | null;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  articles: CollectionArticle[];
  createdAt: string;
  updatedAt: string;
}

// --- Stock Quote (for correlation) ---
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

export interface TickerMatch {
  keyword: string;
  symbol: string;
  name: string;
}
