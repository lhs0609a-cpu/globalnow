import { NEWS_SOURCES } from '@/lib/constants/sources';

export type CollectedArticle = {
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  sourceId: string;
  category: string;
  country: string;
};

export async function collectRSSFeeds(): Promise<CollectedArticle[]> {
  const Parser = (await import('rss-parser')).default;
  const parser = new Parser({
    timeout: 10000,
    headers: { 'User-Agent': 'GLOBALNOW/1.0' },
  });

  const results: CollectedArticle[] = [];

  const feedPromises = NEWS_SOURCES
    .filter(source => source.rssUrl)
    .map(async (source) => {
      try {
        const feed = await parser.parseURL(source.rssUrl!);
        const articles = (feed.items || []).slice(0, 10).map(item => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          contentSnippet: item.contentSnippet || '',
          content: item.content || '',
          sourceId: source.id,
          category: source.category,
          country: source.country,
        }));
        return articles;
      } catch (error) {
        console.error(`Failed to fetch RSS from ${source.name}:`, error);
        return [];
      }
    });

  const feedResults = await Promise.allSettled(feedPromises);
  for (const result of feedResults) {
    if (result.status === 'fulfilled') {
      results.push(...result.value);
    }
  }

  return results;
}
