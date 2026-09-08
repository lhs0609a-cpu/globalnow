import type { NewsItem, NewsCategory } from '@/types/news';
import { NEWS_SOURCES } from '@/lib/constants/sources';

/** Supabase rows use snake_case; UI and RSS items use camelCase. */
export function normalizeNews(row: Record<string, unknown>): NewsItem {
  const sourceId = String(row.sourceId ?? row.source_id ?? 'unknown');
  const category = String(row.category ?? 'international') as NewsCategory;
  const source = NEWS_SOURCES.find(item => item.id === sourceId) ?? {
    id: sourceId, name: sourceId, nameKo: sourceId, country: String(row.country ?? ''),
    countryFlag: '', url: '', category, reliability: 0,
  };
  return {
    id: String(row.id), title: String(row.title ?? ''), url: String(row.url ?? ''),
    titleKo: (row.titleKo ?? row.title_ko) as string | undefined,
    summary: row.summary as string | undefined, summaryKo: (row.summaryKo ?? row.summary_ko) as string | undefined,
    imageUrl: (row.imageUrl ?? row.image_url) as string | undefined,
    publishedAt: String(row.publishedAt ?? row.published_at ?? ''),
    collectedAt: String(row.collectedAt ?? row.collected_at ?? ''),
    source, sourceId, category, country: String(row.country ?? ''),
  };
}
