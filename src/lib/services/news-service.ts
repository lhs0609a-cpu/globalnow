import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockNews, getMockTrending } from '@/lib/demo/mock-news';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { NewsItem, NewsFeedParams, TrendingItem } from '@/types/news';

/** Try fetching live news from RSS, fall back to mock on failure */
async function fetchLiveNews(): Promise<NewsItem[]> {
  try {
    const { collectRSSAsNewsItems } = await import('@/lib/collectors/rss-collector');
    const items = await collectRSSAsNewsItems();
    if (items.length > 0) return items;
  } catch (error) {
    console.error('Live RSS fetch failed:', error);
  }
  return [];
}

export async function getNewsFeed(params?: NewsFeedParams): Promise<{ items: NewsItem[]; total: number }> {
  // Always try live RSS first (cached for 5 minutes)
  const liveItems = await cacheGetOrSet<NewsItem[]>(
    'live-news:all',
    async () => {
      const items = await fetchLiveNews();
      return items;
    },
    300
  );

  if (liveItems && liveItems.length > 0) {
    let filtered = [...liveItems];

    // Sort by published date (most recent first)
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (params?.category && params.category !== 'all') {
      filtered = filtered.filter(n => n.category === params.category);
    }
    if (params?.country) {
      filtered = filtered.filter(n => n.country === params.country);
    }
    if (params?.source) {
      filtered = filtered.filter(n => n.sourceId === params.source);
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchLower) ||
        (n.titleKo && n.titleKo.toLowerCase().includes(searchLower))
      );
    }

    const total = filtered.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const from = (page - 1) * limit;

    return { items: filtered.slice(from, from + limit), total };
  }

  // Fallback: Supabase if configured
  if (!isDemoMode()) {
    try {
      return await cacheGetOrSet(
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
          if (error) return { items: getMockNews(params), total: 10 };
          return { items: (data || []) as unknown as NewsItem[], total: count || 0 };
        },
        60
      );
    } catch {
      // Fall through to mock
    }
  }

  // Final fallback: mock data
  const items = getMockNews(params);
  return { items, total: 10 };
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  // Check live cache first
  const liveItems = await cacheGetOrSet<NewsItem[]>(
    'live-news:all',
    async () => [],
    300
  );
  const liveMatch = liveItems?.find(n => n.id === id);
  if (liveMatch) return liveMatch;

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

export async function getNewsByCountry(country: string, limit = 5): Promise<NewsItem[]> {
  return cacheGetOrSet(
    `live-news:country:${country}`,
    async () => {
      try {
        const { collectRSSByCountryAsNewsItems } = await import('@/lib/collectors/rss-collector');
        const items = await collectRSSByCountryAsNewsItems(country, limit);
        if (items.length > 0) {
          items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          return items.slice(0, limit);
        }
      } catch (error) {
        console.error(`Failed to fetch news for country ${country}:`, error);
      }

      // Fallback: filter from the global live cache or mock
      const allItems = await cacheGetOrSet<NewsItem[]>('live-news:all', async () => [], 300);
      const countryItems = (allItems || []).filter(n => n.country === country);
      if (countryItems.length > 0) return countryItems.slice(0, limit);

      // Final fallback: mock
      const { getMockNews } = await import('@/lib/demo/mock-news');
      return getMockNews({ limit }).filter(n => n.country === country).slice(0, limit);
    },
    300
  );
}

export async function getTrending(source?: string): Promise<TrendingItem[]> {
  return cacheGetOrSet(
    `trending:${source || 'all'}`,
    async () => {
      const results: TrendingItem[] = [];

      // Try HN live (public API, no auth needed)
      if (!source || source === 'hackernews') {
        try {
          const { collectHackerNews } = await import('@/lib/collectors/hn-collector');
          const stories = await collectHackerNews(20);
          if (stories.length > 0) {
            const hnItems: TrendingItem[] = stories.map(s => ({
              id: `hn-${s.id}`,
              title: s.title,
              url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
              source: 'hackernews' as const,
              score: s.score,
              commentCount: s.descendants || 0,
              publishedAt: new Date(s.time * 1000).toISOString(),
            }));
            results.push(...hnItems);
          }
        } catch (error) {
          console.error('HN trending fetch failed:', error);
        }
      }

      // If we got HN data and only wanted HN, return it
      if (source === 'hackernews' && results.length > 0) return results;

      // For other sources or if HN failed, merge with mock data
      const mockItems = getMockTrending(source);

      if (results.length > 0) {
        // We have live HN data - add mock data for other sources
        const otherMocks = mockItems.filter(m => m.source !== 'hackernews');
        return [...results, ...otherMocks];
      }

      // Complete fallback to mock
      return mockItems;
    },
    120
  );
}
