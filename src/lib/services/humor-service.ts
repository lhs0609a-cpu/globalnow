import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockHumor, getMockTrendingHumor } from '@/lib/demo/mock-humor';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { HumorItem } from '@/types/prediction';

export async function getHumorFeed(type?: string, page: number = 1, limit: number = 10): Promise<{ items: HumorItem[]; total: number }> {
  if (isDemoMode()) {
    const items = getMockHumor(type);
    return { items: items.slice((page - 1) * limit, page * limit), total: items.length };
  }

  return cacheGetOrSet(
    `humor:${type || 'all'}:${page}`,
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) {
        const items = getMockHumor(type);
        return { items, total: items.length };
      }

      let query = supabase
        .from('humor')
        .select('*', { count: 'exact' })
        .order('published_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);

      const { data, count, error } = await query;
      if (error) {
        const items = getMockHumor(type);
        return { items, total: items.length };
      }
      return { items: (data || []) as unknown as HumorItem[], total: count || 0 };
    },
    180
  );
}

export async function getTrendingHumor(): Promise<HumorItem[]> {
  if (isDemoMode()) {
    return getMockTrendingHumor();
  }

  return cacheGetOrSet(
    'humor:trending',
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return getMockTrendingHumor();

      const { data, error } = await supabase
        .from('humor')
        .select('*')
        .order('upvotes', { ascending: false })
        .limit(10);

      if (error) return getMockTrendingHumor();
      return (data || []) as unknown as HumorItem[];
    },
    300
  );
}
