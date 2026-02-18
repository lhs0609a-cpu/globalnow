import { NEWS_SOURCES } from '@/lib/constants/sources';
import { NewsItem, NewsCategory } from '@/types/news';

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

/** Collect RSS feeds only from sources matching the given country code */
export async function collectRSSByCountry(country: string, limit = 10): Promise<CollectedArticle[]> {
  const Parser = (await import('rss-parser')).default;
  const parser = new Parser({
    timeout: 10000,
    headers: { 'User-Agent': 'GLOBALNOW/1.0' },
  });

  const countrySources = NEWS_SOURCES.filter(s => s.rssUrl && s.country === country);
  if (countrySources.length === 0) return [];

  const results: CollectedArticle[] = [];

  const feedPromises = countrySources.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.rssUrl!);
      return (feed.items || []).slice(0, limit).map(item => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        contentSnippet: item.contentSnippet || '',
        content: item.content || '',
        sourceId: source.id,
        category: source.category,
        country: source.country,
      }));
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

/** Convert a CollectedArticle to a NewsItem */
export function articleToNewsItem(article: CollectedArticle, index: number): NewsItem {
  const source = NEWS_SOURCES.find(s => s.id === article.sourceId);
  const fallbackSource = {
    id: article.sourceId,
    name: article.sourceId,
    nameKo: article.sourceId,
    country: article.country,
    countryFlag: '',
    url: '',
    category: article.category as NewsCategory,
    reliability: 3,
  };

  return {
    id: `rss-${article.sourceId}-${index}-${Date.now()}`,
    title: article.title,
    summary: article.contentSnippet || undefined,
    url: article.link,
    source: source || fallbackSource,
    sourceId: article.sourceId,
    category: (article.category as NewsCategory) || 'international',
    country: article.country,
    publishedAt: article.pubDate || new Date().toISOString(),
    collectedAt: new Date().toISOString(),
    tags: [],
  };
}

/** Collect RSS feeds and return as NewsItem[] */
export async function collectRSSAsNewsItems(): Promise<NewsItem[]> {
  const articles = await collectRSSFeeds();
  return articles.map((a, i) => articleToNewsItem(a, i));
}

/** Collect RSS feeds for a country and return as NewsItem[] */
export async function collectRSSByCountryAsNewsItems(country: string, limit = 10): Promise<NewsItem[]> {
  const articles = await collectRSSByCountry(country, limit);
  return articles.map((a, i) => articleToNewsItem(a, i));
}
