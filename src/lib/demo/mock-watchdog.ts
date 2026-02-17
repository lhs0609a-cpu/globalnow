import { WatchdogNewsItem } from '@/types/watchdog';
import { MOCK_NEWS } from './mock-news';

function createWatchdogItem(
  newsIndex: number,
  matchedTickers: string[],
  reasons: { field: 'title' | 'titleKo' | 'summary' | 'tags'; ticker: string; keyword: string }[]
): WatchdogNewsItem {
  return {
    ...MOCK_NEWS[newsIndex],
    matchedTickers,
    matchReasons: reasons,
  };
}

export const MOCK_WATCHDOG_NEWS: WatchdogNewsItem[] = [
  // mock-2: OpenAI GPT-5 -> AI tag matches NVDA/GOOGL
  createWatchdogItem(1, ['NVDA', 'GOOGL'], [
    { field: 'tags', ticker: 'NVDA', keyword: 'AI' },
    { field: 'tags', ticker: 'GOOGL', keyword: 'AI' },
  ]),
  // mock-4: TSMC semiconductor -> matches 005930, 000660
  createWatchdogItem(3, ['005930', '000660'], [
    { field: 'tags', ticker: '005930', keyword: 'Semiconductor' },
    { field: 'title', ticker: '005930', keyword: 'Semiconductor' },
    { field: 'tags', ticker: '000660', keyword: 'Semiconductor' },
  ]),
  // mock-8: AI chip export controls -> matches NVDA
  createWatchdogItem(7, ['NVDA'], [
    { field: 'tags', ticker: 'NVDA', keyword: 'AI' },
    { field: 'titleKo', ticker: 'NVDA', keyword: 'AI 칩' },
  ]),
  // mock-3: EU-China EV deal -> matches TSLA
  createWatchdogItem(2, ['TSLA'], [
    { field: 'tags', ticker: 'TSLA', keyword: 'EV' },
    { field: 'title', ticker: 'TSLA', keyword: 'Electric Vehicles' },
  ]),
];

export function getMockWatchdogNews(tickers: string[]): WatchdogNewsItem[] {
  if (tickers.length === 0) return [];
  return MOCK_WATCHDOG_NEWS.filter(item =>
    item.matchedTickers.some(t => tickers.includes(t))
  );
}
