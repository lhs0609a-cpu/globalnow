export type MarketIndex = {
  symbol: string;
  name: string;
  nameKo: string;
  value: number;
  change: number;
  changePercent: number;
  updatedAt: string;
};

export type CryptoData = {
  id: string;
  symbol: string;
  name: string;
  nameKo: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  sparkline?: number[];
  updatedAt: string;
};

export type ForexRate = {
  pair: string;
  name: string;
  nameKo: string;
  rate: number;
  change: number;
  changePercent: number;
  updatedAt: string;
};

export type FearGreedIndex = {
  value: number;
  label: string;
  labelKo: string;
  previousValue: number;
  updatedAt: string;
};

export type MarketData = {
  indices: MarketIndex[];
  crypto: CryptoData[];
  forex: ForexRate[];
  fearGreed: FearGreedIndex;
  updatedAt: string;
};
