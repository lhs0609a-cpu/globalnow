import { NewsItem } from './news';

export type WatchlistItem = {
  ticker: string;
  name: string;
  nameKo: string;
  exchange: 'NYSE' | 'NASDAQ' | 'KRX';
  addedAt: string;
};

export type WatchdogMatchReason = {
  field: 'title' | 'titleKo' | 'summary' | 'tags';
  ticker: string;
  keyword: string;
};

export type WatchdogNewsItem = NewsItem & {
  matchedTickers: string[];
  matchReasons: WatchdogMatchReason[];
};

export type WatchdogFeedResult = {
  items: WatchdogNewsItem[];
  total: number;
  page: number;
  limit: number;
};
