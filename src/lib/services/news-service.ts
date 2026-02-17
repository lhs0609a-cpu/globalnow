import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockNews, getMockTrending } from '@/lib/demo/mock-news';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { NewsItem, NewsFeedParams, TrendingItem } from '@/types/news';

export async function getNewsFeed(params?: NewsFeedParams): Promise<{ items: NewsItem[]; total: number }> {
  if (isDemoMode()) {
    const items = getMockNews(params);
    return { items, total: 10 };
  }

  return cacheGetOrSet(
    `news:feed:${JSON.stringify(params)}`,
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return { items: getMockNews(params), total: 10 };

      let query = supabase
        .from('news')
        .select('*', { count: 'exact' })
        .order('published_at', { ascending: false });

      if (params?.category && params.category !== 'all') {
        query = query.eq('category', params.category);
      }
      if (params?.country) {
        query = query.eq('country', params.country);
      }
      if (params?.source) {
        query = query.eq('source_id', params.source);
      }
      if (params?.search) {
        query = query.or(`title.ilike.%${params.search}%,title_ko.ilike.%${params.search}%`);
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const from = (page - 1) * limit;

      query = query.range(from, from + limit - 1);

      const { data, count, error } = await query;
      if (error) {
        console.error('News fetch error:', error);
        return { items: getMockNews(params), total: 10 };
      }

      return { items: (data || []) as unknown as NewsItem[], total: count || 0 };
    },
    60
  );
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  if (isDemoMode()) {
    const { MOCK_NEWS } = await import('@/lib/demo/mock-news');
    return MOCK_NEWS.find(n => n.id === id) || null;
  }

  return cacheGetOrSet(
    `news:${id}`,
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null;
      return data as unknown as NewsItem;
    },
    300
  );
}

export async function getTrending(source?: string): Promise<TrendingItem[]> {
  if (isDemoMode()) {
    return getMockTrending(source);
  }

  return cacheGetOrSet(
    `trending:${source || 'all'}`,
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return getMockTrending(source);

      let query = supabase
        .from('trending')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);

      if (source) {
        query = query.eq('source', source);
      }

      const { data, error } = await query;
      if (error) return getMockTrending(source);
      return (data || []) as unknown as TrendingItem[];
    },
    120
  );
}
