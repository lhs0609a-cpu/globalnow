import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockMarketData } from '@/lib/demo/mock-market';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { MarketData } from '@/types/market';

export async function getMarketData(): Promise<MarketData> {
  if (isDemoMode()) {
    return getMockMarketData();
  }

  return cacheGetOrSet(
    'market:all',
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return getMockMarketData();

      const [indicesRes, cryptoRes, forexRes, fearGreedRes] = await Promise.all([
        supabase.from('market_data').select('*').eq('type', 'index').order('symbol'),
        supabase.from('market_data').select('*').eq('type', 'crypto').order('market_cap', { ascending: false }).limit(10),
        supabase.from('market_data').select('*').eq('type', 'forex').order('pair'),
        supabase.from('market_data').select('*').eq('type', 'fear_greed').single(),
      ]);

      const mockData = getMockMarketData();
      return {
        indices: (indicesRes.data || mockData.indices) as unknown as MarketData['indices'],
        crypto: (cryptoRes.data || mockData.crypto) as unknown as MarketData['crypto'],
        forex: (forexRes.data || mockData.forex) as unknown as MarketData['forex'],
        fearGreed: (fearGreedRes.data || mockData.fearGreed) as unknown as MarketData['fearGreed'],
        updatedAt: new Date().toISOString(),
      };
    },
    120
  );
}
