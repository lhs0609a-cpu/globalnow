import { KoreaEvent } from '@/types/event';

const TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}

export async function collectFestaEvents(): Promise<KoreaEvent[]> {
  try {
    const res = await withTimeout(
      fetch('https://festa.io/api/v1/events?page=1&pageSize=20&order=startDate', {
        headers: { 'User-Agent': 'GLOBALNOW/1.0' },
      }),
      TIMEOUT_MS
    );

    if (!res.ok) return [];

    const data = await res.json();
    const rows = data?.rows || data?.events || [];
    if (!Array.isArray(rows)) return [];

    return rows.slice(0, 20).map((item: { id?: number; name?: string; title?: string; description?: string; startDate?: string; endDate?: string; location?: string; eventUrl?: string; metadata?: { tags?: string[] }; isFree?: boolean }, index: number) => ({
      id: `festa-${item.id || index}`,
      title: item.name || item.title || '',
      titleKo: item.name || item.title || '',
      description: item.description || '',
      category: 'meetup' as const,
      venue: item.location || 'Online',
      startDate: item.startDate || new Date().toISOString(),
      endDate: item.endDate || item.startDate || new Date().toISOString(),
      url: item.eventUrl || `https://festa.io/events/${item.id}`,
      tags: item.metadata?.tags || [],
      isFree: item.isFree ?? true,
      source: 'festa' as const,
    }));
  } catch (error) {
    console.error('Festa event collection failed:', error);
    return [];
  }
}

export async function collectAllKoreaEvents(): Promise<KoreaEvent[]> {
  const results = await Promise.allSettled([
    collectFestaEvents(),
  ]);

  const items: KoreaEvent[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    }
  }
  return items;
}
