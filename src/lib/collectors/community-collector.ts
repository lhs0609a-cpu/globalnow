import { TrendingItem } from '@/types/news';

const TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}

// --- JSON Sources ---

export async function collectV2EX(): Promise<TrendingItem[]> {
  try {
    const res = await withTimeout(
      fetch('https://www.v2ex.com/api/topics/hot.json', {
        headers: { 'User-Agent': 'GLOBALNOW/1.0' },
      }),
      TIMEOUT_MS
    );
    const data = await res.json();
    return (data as Array<{ id: number; title: string; url: string; replies: number; created: number }>)
      .slice(0, 20)
      .map((item) => ({
        id: `v2ex-${item.id}`,
        title: item.title,
        url: item.url || `https://www.v2ex.com/t/${item.id}`,
        source: 'v2ex' as const,
        score: item.replies || 0,
        commentCount: item.replies || 0,
        region: 'CN',
        publishedAt: new Date(item.created * 1000).toISOString(),
      }));
  } catch (error) {
    console.error('V2EX collection failed:', error);
    return [];
  }
}

export async function collectQiita(): Promise<TrendingItem[]> {
  try {
    const res = await withTimeout(
      fetch('https://qiita.com/api/v2/items?per_page=20&query=stocks:>10', {
        headers: { 'User-Agent': 'GLOBALNOW/1.0' },
      }),
      TIMEOUT_MS
    );
    const data = await res.json();
    return (data as Array<{ id: string; title: string; url: string; likes_count: number; comments_count: number; created_at: string }>)
      .slice(0, 20)
      .map((item) => ({
        id: `qiita-${item.id}`,
        title: item.title,
        url: item.url,
        source: 'qiita' as const,
        score: item.likes_count || 0,
        commentCount: item.comments_count || 0,
        region: 'JP',
        publishedAt: item.created_at,
      }));
  } catch (error) {
    console.error('Qiita collection failed:', error);
    return [];
  }
}

export async function collectLobsters(): Promise<TrendingItem[]> {
  try {
    const res = await withTimeout(
      fetch('https://lobste.rs/hottest.json', {
        headers: { 'User-Agent': 'GLOBALNOW/1.0' },
      }),
      TIMEOUT_MS
    );
    const data = await res.json();
    return (data as Array<{ short_id: string; title: string; url: string; score: number; comment_count: number; created_at: string }>)
      .slice(0, 20)
      .map((item) => ({
        id: `lobsters-${item.short_id}`,
        title: item.title,
        url: item.url || `https://lobste.rs/s/${item.short_id}`,
        source: 'lobsters' as const,
        score: item.score || 0,
        commentCount: item.comment_count || 0,
        region: 'EU',
        publishedAt: item.created_at,
      }));
  } catch (error) {
    console.error('Lobsters collection failed:', error);
    return [];
  }
}

export async function collectTabNews(): Promise<TrendingItem[]> {
  try {
    const res = await withTimeout(
      fetch('https://www.tabnews.com.br/api/v1/contents?strategy=relevant&per_page=20', {
        headers: { 'User-Agent': 'GLOBALNOW/1.0' },
      }),
      TIMEOUT_MS
    );
    const data = await res.json();
    return (data as Array<{ id: string; slug: string; title: string; owner_username: string; tabcoins: number; children_deep_count: number; created_at: string }>)
      .slice(0, 20)
      .map((item) => ({
        id: `tabnews-${item.id}`,
        title: item.title,
        url: `https://www.tabnews.com.br/${item.owner_username}/${item.slug}`,
        source: 'tabnews' as const,
        score: item.tabcoins || 0,
        commentCount: item.children_deep_count || 0,
        region: 'BR',
        publishedAt: item.created_at,
      }));
  } catch (error) {
    console.error('TabNews collection failed:', error);
    return [];
  }
}

export async function collectDevTo(): Promise<TrendingItem[]> {
  try {
    const res = await withTimeout(
      fetch('https://dev.to/api/articles?per_page=20&top=1', {
        headers: { 'User-Agent': 'GLOBALNOW/1.0' },
      }),
      TIMEOUT_MS
    );
    const data = await res.json();
    return (data as Array<{ id: number; title: string; url: string; positive_reactions_count: number; comments_count: number; published_at: string }>)
      .slice(0, 20)
      .map((item) => ({
        id: `devto-${item.id}`,
        title: item.title,
        url: item.url,
        source: 'devto' as const,
        score: item.positive_reactions_count || 0,
        commentCount: item.comments_count || 0,
        region: 'GLOBAL',
        publishedAt: item.published_at,
      }));
  } catch (error) {
    console.error('DEV.to collection failed:', error);
    return [];
  }
}

// --- RSS Sources ---

async function collectRSS(
  url: string,
  sourceId: TrendingItem['source'],
  region: string
): Promise<TrendingItem[]> {
  try {
    const Parser = (await import('rss-parser')).default;
    const parser = new Parser({ timeout: TIMEOUT_MS, headers: { 'User-Agent': 'GLOBALNOW/1.0' } });
    const feed = await withTimeout(parser.parseURL(url), TIMEOUT_MS);
    return (feed.items || []).slice(0, 20).map((item, index) => ({
      id: `${sourceId}-${index}-${Date.now()}`,
      title: item.title || '',
      url: item.link || '',
      source: sourceId,
      score: 0,
      region,
      publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
    }));
  } catch (error) {
    console.error(`RSS collection failed for ${sourceId}:`, error);
    return [];
  }
}

export function collectZhihu() { return collectRSS('https://rsshub.app/zhihu/hot', 'zhihu', 'CN'); }
export function collect36kr() { return collectRSS('https://rsshub.app/36kr/hot', '36kr', 'CN'); }
export function collectHatena() { return collectRSS('https://b.hatena.ne.jp/hotentry/it.rss', 'hatena', 'JP'); }
export function collectGeekNews() { return collectRSS('https://news.hada.io/rss', 'geeknews', 'KR'); }
export function collectDisquiet() { return collectRSS('https://disquiet.io/rss/makers', 'disquiet', 'KR'); }

// --- Aggregate ---

export async function collectAllCommunities(): Promise<TrendingItem[]> {
  const results = await Promise.allSettled([
    collectV2EX(),
    collectQiita(),
    collectLobsters(),
    collectTabNews(),
    collectDevTo(),
    collectZhihu(),
    collect36kr(),
    collectHatena(),
    collectGeekNews(),
    collectDisquiet(),
  ]);

  const items: TrendingItem[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    }
  }
  return items;
}
