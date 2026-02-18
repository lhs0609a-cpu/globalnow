import { getMockMarketData } from '@/lib/demo/mock-market';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { MarketData, CryptoData } from '@/types/market';

/** Fetch live crypto data from CoinGecko (public API, no auth needed) */
async function fetchLiveCrypto(): Promise<CryptoData[]> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano&sparkline=true&price_change_percentage=24h',
      {
        headers: { 'User-Agent': 'GLOBALNOW/1.0' },
        next: { revalidate: 120 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const nameKoMap: Record<string, string> = {
      bitcoin: '비트코인',
      ethereum: '이더리움',
      solana: '솔라나',
      ripple: '리플',
      cardano: '카르다노',
    };

    return data.map((coin: Record<string, unknown>) => ({
      id: coin.id as string,
      symbol: ((coin.symbol as string) || '').toUpperCase(),
      name: coin.name as string,
      nameKo: nameKoMap[(coin.id as string)] || (coin.name as string),
      price: coin.current_price as number,
      change24h: coin.price_change_percentage_24h as number,
      marketCap: coin.market_cap as number,
      volume24h: coin.total_volume as number,
      sparkline: (coin.sparkline_in_7d as { price: number[] })?.price?.slice(-7),
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('CoinGecko fetch failed:', error);
    return [];
  }
}

export async function getMarketData(): Promise<MarketData> {
  return cacheGetOrSet(
    'market:all',
    async () => {
      const mockData = getMockMarketData();

      // Try live crypto data from CoinGecko
      const liveCrypto = await fetchLiveCrypto();

      return {
        indices: mockData.indices, // Yahoo Finance needs auth, keep mock
        crypto: liveCrypto.length > 0 ? liveCrypto : mockData.crypto,
        forex: mockData.forex, // Forex APIs need auth, keep mock
        fearGreed: mockData.fearGreed,
        updatedAt: new Date().toISOString(),
      };
    },
    120
  );
}
