import { WatchlistItem } from '@/types/watchdog';

export type PresetGroup = {
  label: string;
  items: WatchlistItem[];
};

export const WATCHLIST_PRESETS: PresetGroup[] = [
  {
    label: 'US Big Tech',
    items: [
      { ticker: 'AAPL', name: 'Apple', nameKo: '애플', exchange: 'NASDAQ', addedAt: '' },
      { ticker: 'MSFT', name: 'Microsoft', nameKo: '마이크로소프트', exchange: 'NASDAQ', addedAt: '' },
      { ticker: 'GOOGL', name: 'Alphabet', nameKo: '구글(알파벳)', exchange: 'NASDAQ', addedAt: '' },
      { ticker: 'AMZN', name: 'Amazon', nameKo: '아마존', exchange: 'NASDAQ', addedAt: '' },
      { ticker: 'NVDA', name: 'NVIDIA', nameKo: '엔비디아', exchange: 'NASDAQ', addedAt: '' },
      { ticker: 'META', name: 'Meta', nameKo: '메타', exchange: 'NASDAQ', addedAt: '' },
      { ticker: 'TSLA', name: 'Tesla', nameKo: '테슬라', exchange: 'NASDAQ', addedAt: '' },
    ],
  },
  {
    label: 'KR Semiconductor',
    items: [
      { ticker: '005930', name: 'Samsung Electronics', nameKo: '삼성전자', exchange: 'KRX', addedAt: '' },
      { ticker: '000660', name: 'SK hynix', nameKo: 'SK하이닉스', exchange: 'KRX', addedAt: '' },
    ],
  },
  {
    label: 'KR Battery',
    items: [
      { ticker: '373220', name: 'LG Energy Solution', nameKo: 'LG에너지솔루션', exchange: 'KRX', addedAt: '' },
      { ticker: '006400', name: 'Samsung SDI', nameKo: '삼성SDI', exchange: 'KRX', addedAt: '' },
    ],
  },
];

/** Flat lookup: ticker -> company name/nameKo for matching */
export const TICKER_NAME_MAP: Record<string, { name: string; nameKo: string }> = {};
for (const group of WATCHLIST_PRESETS) {
  for (const item of group.items) {
    TICKER_NAME_MAP[item.ticker] = { name: item.name, nameKo: item.nameKo };
  }
}
