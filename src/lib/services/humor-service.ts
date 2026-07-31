import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockHumor, getMockTrendingHumor } from '@/lib/demo/mock-humor';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { HumorItem } from '@/types/prediction';
import { collectHumor, CollectedHumor } from '@/lib/collectors/humor-collector';

/** Convert CollectedHumor from collector to HumorItem */
function toHumorItem(item: CollectedHumor, index: number): HumorItem {
  const now = new Date().toISOString();
  return {
    id: `live-${item.source.toLowerCase().replace(/[^a-z0-9]/g, '')}-${index}`,
    title: item.title,
    type: item.type,
    imageUrl: item.imageUrl,
    source: item.source,
    sourceUrl: item.url,
    upvotes: item.upvotes,
    publishedAt: now,
    collectedAt: now,
  };
}

export async function getHumorFeed(type?: string, page: number = 1, limit: number = 10): Promise<{ items: HumorItem[]; total: number }> {
  return cacheGetOrSet(
    `humor:${type || 'all'}:${page}`,
    async () => {
      // Try live collector first (XKCD, Reddit, RSS)
      try {
        const collected = await collectHumor();
        if (collected.length > 0) {
          let items = collected.map(toHumorItem);
          if (type) {
            items = items.filter(i => i.type === type);
          }
          console.log(`[Humor] Collected ${items.length} live items`);
          const total = items.length;
          return { items: items.slice((page - 1) * limit, page * limit), total };
        }
      } catch (error) {
        console.error('Humor collector failed:', error);
      }

      // Try Supabase if available
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
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
            if (!error && data && data.length > 0) {
              return { items: data as unknown as HumorItem[], total: count || 0 };
            }
          }
        } catch {
          // Supabase not available
        }
      }

      // Fallback to mock
      const items = getMockHumor(type);
      return { items: items.slice((page - 1) * limit, page * limit), total: items.length };
    },
    180
  );
}

export async function getTrendingHumor(): Promise<HumorItem[]> {
  return cacheGetOrSet(
    'humor:trending',
    async () => {
      // Try live collector first
      try {
        const collected = await collectHumor();
        if (collected.length > 0) {
          const items = collected.map(toHumorItem);
          // Sort by upvotes descending for "trending"
          items.sort((a, b) => b.upvotes - a.upvotes);
          console.log(`[Humor] Trending: ${items.length} live items`);
          return items.slice(0, 10);
        }
      } catch (error) {
        console.error('Humor trending collector failed:', error);
      }

      // Try Supabase if available
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('humor')
              .select('*')
              .order('upvotes', { ascending: false })
              .limit(10);

            if (!error && data && data.length > 0) {
              return data as unknown as HumorItem[];
            }
          }
        } catch {
          // Supabase not available
        }
      }

      return getMockTrendingHumor();
    },
    300
  );
}
