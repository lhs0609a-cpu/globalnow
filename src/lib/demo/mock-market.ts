import { MarketData, MarketIndex, CryptoData, ForexRate, FearGreedIndex } from '@/types/market';

const mockIndices: MarketIndex[] = [
  { symbol: 'SPX', name: 'S&P 500', nameKo: 'S&P 500', value: 5234.18, change: 45.32, changePercent: 0.87, updatedAt: new Date().toISOString() },
  { symbol: 'DJI', name: 'Dow Jones', nameKo: '다우존스', value: 39150.33, change: 312.45, changePercent: 0.80, updatedAt: new Date().toISOString() },
  { symbol: 'IXIC', name: 'NASDAQ', nameKo: '나스닥', value: 16432.78, change: -23.45, changePercent: -0.14, updatedAt: new Date().toISOString() },
  { symbol: 'N225', name: 'Nikkei 225', nameKo: '닛케이 225', value: 40123.45, change: 567.89, changePercent: 1.43, updatedAt: new Date().toISOString() },
  { symbol: 'HSI', name: 'Hang Seng', nameKo: '항솅', value: 17234.56, change: -123.45, changePercent: -0.71, updatedAt: new Date().toISOString() },
  { symbol: 'KOSPI', name: 'KOSPI', nameKo: '코스피', value: 2687.45, change: 15.23, changePercent: 0.57, updatedAt: new Date().toISOString() },
];
const mockCrypto: CryptoData[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', nameKo: '비트코인', price: 102345.67, change24h: 3.45, marketCap: 2010000000000, volume24h: 45000000000, sparkline: [98000, 99500, 100200, 99800, 101000, 102000, 102345], updatedAt: new Date().toISOString() },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', nameKo: '이더리움', price: 3856.78, change24h: 2.12, marketCap: 463000000000, volume24h: 18000000000, sparkline: [3700, 3750, 3800, 3780, 3820, 3850, 3856], updatedAt: new Date().toISOString() },
  { id: 'solana', symbol: 'SOL', name: 'Solana', nameKo: '솔라나', price: 178.45, change24h: -1.23, marketCap: 82000000000, volume24h: 5600000000, sparkline: [185, 182, 180, 179, 177, 178, 178], updatedAt: new Date().toISOString() },
];

const mockForex: ForexRate[] = [
  { pair: 'USD/KRW', name: 'USD/KRW', nameKo: '달러/원', rate: 1342.50, change: -3.20, changePercent: -0.24, updatedAt: new Date().toISOString() },
  { pair: 'EUR/KRW', name: 'EUR/KRW', nameKo: '유로/원', rate: 1456.78, change: 5.40, changePercent: 0.37, updatedAt: new Date().toISOString() },
  { pair: 'JPY/KRW', name: 'JPY/KRW', nameKo: '엔/원(100)', rate: 892.34, change: -1.56, changePercent: -0.17, updatedAt: new Date().toISOString() },
  { pair: 'CNY/KRW', name: 'CNY/KRW', nameKo: '위안/원', rate: 185.67, change: 0.89, changePercent: 0.48, updatedAt: new Date().toISOString() },
];
const mockFearGreed: FearGreedIndex = {
  value: 72,
  label: 'Greed',
  labelKo: '탐욕',
  previousValue: 68,
  updatedAt: new Date().toISOString(),
};

export const MOCK_MARKET_DATA: MarketData = {
  indices: mockIndices,
  crypto: mockCrypto,
  forex: mockForex,
  fearGreed: mockFearGreed,
  updatedAt: new Date().toISOString(),
};

export function getMockMarketData(): MarketData {
  return MOCK_MARKET_DATA;
}
