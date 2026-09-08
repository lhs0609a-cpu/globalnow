import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockNews, getMockTrending } from '@/lib/demo/mock-news';
import { cacheGet, cacheGetOrSet } from '@/lib/redis/cache';
import { normalizeNews } from '@/lib/utils/normalize-news';
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

export async function getNewsFeed(params?: NewsFeedParams): Promise<{ items: NewsItem[]; total: number; mode: 'live' | 'demo' | 'stored' }> {
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

    // Sort by published date (most recent first), treating invalid dates as 0
    filtered.sort((a, b) => (new Date(b.publishedAt).getTime() || 0) - (new Date(a.publishedAt).getTime() || 0));

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

    return { items: filtered.slice(from, from + limit), total, mode: 'live' };
  }

  // Fallback: Supabase if configured
  if (!isDemoMode()) {
    try {
      return await cacheGetOrSet<{ items: NewsItem[]; total: number; mode: 'stored' }>(
        `news:feed:${JSON.stringify(params)}`,
        async () => {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (!supabase) throw new Error('News storage unavailable');

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
          if (error) throw error;
          return { items: (data || []).map(normalizeNews), total: count || 0, mode: 'stored' };
        },
        60
      );
    } catch {
      throw new Error('News sources unavailable');
    }
  }

  // Final fallback: mock data
  const all = getMockNews({ ...params, page: 1, limit: 1000 });
  const from = ((params?.page || 1) - 1) * (params?.limit || 10);
  return { items: all.slice(from, from + (params?.limit || 10)), total: all.length, mode: 'demo' };
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  // Check live cache first
  const liveItems = await cacheGet<NewsItem[]>('live-news:all');
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
      return normalizeNews(data);
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
          items.sort((a, b) => (new Date(b.publishedAt).getTime() || 0) - (new Date(a.publishedAt).getTime() || 0));
          return items.slice(0, limit);
        }
      } catch (error) {
        console.error(`Failed to fetch news for country ${country}:`, error);
      }

      // Fallback: filter from the global live cache or mock
      const allItems = await cacheGet<NewsItem[]>('live-news:all');
      const countryItems = (allItems || []).filter(n => n.country === country);
      if (countryItems.length > 0) return countryItems.slice(0, limit);

      // Final fallback: mock
      const { getMockNews } = await import('@/lib/demo/mock-news');
      return getMockNews({ limit }).filter(n => n.country === country).slice(0, limit);
    },
    300
  );
}

export async function getTrending(source?: string, region?: string): Promise<TrendingItem[]> {
  return cacheGetOrSet(
    `trending:${source || 'all'}:${region || 'all'}`,
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
              region: 'US',
              publishedAt: new Date(s.time * 1000).toISOString(),
            }));
            results.push(...hnItems);
          }
        } catch (error) {
          console.error('HN trending fetch failed:', error);
        }
      }

      // Try community collectors for new sources
      const newSources = ['v2ex', 'zhihu', '36kr', 'qiita', 'hatena', 'geeknews', 'disquiet', 'lobsters', 'tabnews', 'devto'];
      const shouldCollectCommunities = !source || newSources.includes(source);

      if (shouldCollectCommunities) {
        try {
          const { collectAllCommunities } = await import('@/lib/collectors/community-collector');
          const communityItems = await collectAllCommunities();
          if (communityItems.length > 0) {
            if (source) {
              results.push(...communityItems.filter(c => c.source === source));
            } else {
              results.push(...communityItems);
            }
          }
        } catch (error) {
          console.error('Community collection failed:', error);
        }
      }

      // If we have live data for the requested source, return it
      if (source && results.length > 0) {
        if (region && region !== 'all') {
          return results.filter(r => r.region === region);
        }
        return results;
      }

      // Merge with mock data for sources we don't have live data for
      const mockItems = getMockTrending(source, region);
      const { getMockCommunityTrending } = await import('@/lib/demo/mock-communities');
      const mockCommunity = getMockCommunityTrending(source, region);

      if (results.length > 0) {
        // We have some live data — add mock for missing sources
        const liveSources = new Set(results.map(r => r.source));
        const otherMocks = [...mockItems, ...mockCommunity].filter(m => !liveSources.has(m.source));
        const combined = [...results, ...otherMocks];
        if (region && region !== 'all') {
          return combined.filter(r => r.region === region);
        }
        return combined;
      }

      // Complete fallback to mock
      const allMock = [...mockItems, ...mockCommunity];
      if (region && region !== 'all') {
        return allMock.filter(r => r.region === region);
      }
      return allMock;
    },
    120
  );
}
