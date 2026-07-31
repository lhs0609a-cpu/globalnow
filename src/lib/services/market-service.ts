import { getMockMarketData } from '@/lib/demo/mock-market';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { MarketData, CryptoData, ForexRate, FearGreedIndex, MarketIndex } from '@/types/market';

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

/** Fetch live forex data from Frankfurter API (free, no key needed) */
async function fetchLiveForex(): Promise<ForexRate[]> {
  try {
    const { collectForexData } = await import('@/lib/collectors/market-collector');
    return await collectForexData();
  } catch (error) {
    console.error('Forex fetch failed:', error);
    return [];
  }
}

/** Fetch live Fear & Greed Index from alternative.me (free, no key needed) */
async function fetchLiveFearGreed(): Promise<FearGreedIndex | null> {
  try {
    const { collectFearGreedIndex } = await import('@/lib/collectors/market-collector');
    return await collectFearGreedIndex();
  } catch (error) {
    console.error('Fear & Greed fetch failed:', error);
    return null;
  }
}

/** Fetch live stock index data from Yahoo Finance (unofficial, no key needed) */
async function fetchLiveIndices(): Promise<MarketIndex[]> {
  try {
    const { collectIndexData } = await import('@/lib/collectors/market-collector');
    return await collectIndexData();
  } catch (error) {
    console.error('Index fetch failed:', error);
    return [];
  }
}

export async function getMarketData(): Promise<MarketData & { isLive: boolean }> {
  return cacheGetOrSet(
    'market:all',
    async () => {
      const mockData = getMockMarketData();

      // Fetch all live data in parallel
      const [liveCrypto, liveForex, liveFearGreed, liveIndices] = await Promise.allSettled([
        fetchLiveCrypto(),
        fetchLiveForex(),
        fetchLiveFearGreed(),
        fetchLiveIndices(),
      ]);

      const crypto = liveCrypto.status === 'fulfilled' && liveCrypto.value.length > 0
        ? liveCrypto.value : mockData.crypto;
      const forex = liveForex.status === 'fulfilled' && liveForex.value.length > 0
        ? liveForex.value : mockData.forex;
      const fearGreed = liveFearGreed.status === 'fulfilled' && liveFearGreed.value
        ? liveFearGreed.value : mockData.fearGreed;
      const indices = liveIndices.status === 'fulfilled' && liveIndices.value.length > 0
        ? liveIndices.value : mockData.indices;

      const hasAnyLive = (liveCrypto.status === 'fulfilled' && liveCrypto.value.length > 0)
        || (liveForex.status === 'fulfilled' && liveForex.value.length > 0)
        || (liveFearGreed.status === 'fulfilled' && liveFearGreed.value !== null)
        || (liveIndices.status === 'fulfilled' && liveIndices.value.length > 0);

      return {
        indices,
        crypto,
        forex,
        fearGreed,
        updatedAt: new Date().toISOString(),
        isLive: hasAnyLive,
      };
    },
    120
  );
}
