import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockWatchdogNews } from '@/lib/demo/mock-watchdog';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { TICKER_NAME_MAP } from '@/lib/constants/watchlist-presets';
import { WatchdogNewsItem, WatchdogMatchReason, WatchdogFeedResult } from '@/types/watchdog';
import { NewsItem } from '@/types/news';

/** Build search keywords for a given ticker */
function getSearchTerms(ticker: string): string[] {
  const terms = [ticker];
  const info = TICKER_NAME_MAP[ticker];
  if (info) {
    terms.push(info.name);
    if (info.nameKo) terms.push(info.nameKo);
  }
  return terms;
}

/** Compute match reasons for a news item against tickers */
export function computeMatchReasons(
  news: NewsItem,
  tickers: string[]
): { matchedTickers: string[]; matchReasons: WatchdogMatchReason[] } {
  const matchedTickers: string[] = [];
  const matchReasons: WatchdogMatchReason[] = [];

  for (const ticker of tickers) {
    const terms = getSearchTerms(ticker);
    let matched = false;

    for (const keyword of terms) {
      const lower = keyword.toLowerCase();

      if (news.title.toLowerCase().includes(lower)) {
        matchReasons.push({ field: 'title', ticker, keyword });
        matched = true;
      }
      if (news.titleKo?.toLowerCase().includes(lower)) {
        matchReasons.push({ field: 'titleKo', ticker, keyword });
        matched = true;
      }
      if (news.summary?.toLowerCase().includes(lower)) {
        matchReasons.push({ field: 'summary', ticker, keyword });
        matched = true;
      }
      if (news.tags?.some(t => t.toLowerCase().includes(lower))) {
        matchReasons.push({ field: 'tags', ticker, keyword });
        matched = true;
      }
    }

    if (matched) {
      matchedTickers.push(ticker);
    }
  }

  return { matchedTickers, matchReasons };
}

export async function getWatchdogNews(
  tickers: string[],
  page = 1,
  limit = 20
): Promise<WatchdogFeedResult> {
  if (tickers.length === 0) {
    return { items: [], total: 0, page, limit };
  }

  const cacheKey = `watchdog:${[...tickers].sort().join(',')}:p${page}:l${limit}`;

  return cacheGetOrSet(
    cacheKey,
    async () => {
      // 1st priority: Try live RSS news
      try {
        const liveNews = await cacheGetOrSet<NewsItem[]>('live-news:all', async () => {
          const { collectRSSAsNewsItems } = await import('@/lib/collectors/rss-collector');
          return collectRSSAsNewsItems();
        }, 300);

        if (liveNews && liveNews.length > 0) {
          const items: WatchdogNewsItem[] = [];
          for (const newsItem of liveNews) {
            const { matchedTickers, matchReasons } = computeMatchReasons(newsItem, tickers);
            if (matchedTickers.length > 0) {
              items.push({ ...newsItem, matchedTickers, matchReasons });
            }
          }

          if (items.length > 0) {
            items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
            const total = items.length;
            const start = (page - 1) * limit;
            return { items: items.slice(start, start + limit), total, page, limit };
          }
        }
      } catch (error) {
        console.error('Watchdog live news fetch failed:', error);
      }

      // 2nd priority: Supabase if configured
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            const allTerms = tickers.flatMap(getSearchTerms);
            const orConditions = allTerms
              .map(term => `title.ilike.%${term}%,title_ko.ilike.%${term}%,summary.ilike.%${term}%`)
              .join(',');

            const { data, error, count } = await supabase
              .from('news')
              .select('*', { count: 'exact' })
              .or(orConditions)
              .order('published_at', { ascending: false })
              .range((page - 1) * limit, page * limit - 1);

            if (!error && data) {
              const items: WatchdogNewsItem[] = [];
              for (const row of data) {
                const newsItem: NewsItem = {
                  id: row.id,
                  title: row.title,
                  titleKo: row.title_ko,
                  summary: row.summary,
                  summaryKo: row.summary_ko,
                  url: row.url,
                  imageUrl: row.image_url,
                  source: { id: row.source_id, name: row.source_id, nameKo: row.source_id, country: row.country, countryFlag: '', url: '', category: row.category, reliability: 4 },
                  sourceId: row.source_id,
                  category: row.category,
                  country: row.country,
                  publishedAt: row.published_at,
                  collectedAt: row.collected_at,
                  sentiment: row.sentiment,
                  tags: row.tags,
                  viewCount: row.view_count,
                  bookmarkCount: row.bookmark_count,
                };

                const { matchedTickers, matchReasons } = computeMatchReasons(newsItem, tickers);
                if (matchedTickers.length > 0) {
                  items.push({ ...newsItem, matchedTickers, matchReasons });
                }
              }

              return { items, total: count || items.length, page, limit };
            }
          }
        } catch {
          // Fall through to mock
        }
      }

      // 3rd priority: mock data
      const items = getMockWatchdogNews(tickers);
      const start = (page - 1) * limit;
      return {
        items: items.slice(start, start + limit),
        total: items.length,
        page,
        limit,
      };
    },
    60
  );
}
