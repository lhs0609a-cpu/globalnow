import { KoreaEvent, EventFilterParams, EventStatus } from '@/types/event';
import { KOREA_EVENTS } from '@/lib/constants/korea-events-data';
import { cacheGetOrSet } from '@/lib/redis/cache';

function computeStatus(startDate: string, endDate: string): EventStatus {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Set end to end of day
  end.setHours(23, 59, 59, 999);

  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'ongoing';
}

function enrichEvent(event: KoreaEvent): KoreaEvent {
  return {
    ...event,
    status: computeStatus(event.startDate, event.endDate),
  };
}

export async function getKoreaEvents(params?: EventFilterParams): Promise<KoreaEvent[]> {
  return cacheGetOrSet(
    `events:korea:${JSON.stringify(params || {})}`,
    async () => {
      // Try live collection
      let liveEvents: KoreaEvent[] = [];
      try {
        const { collectAllKoreaEvents } = await import('@/lib/collectors/event-collector');
        liveEvents = await collectAllKoreaEvents();
      } catch (error) {
        console.error('Live event collection failed:', error);
      }

      // Merge with curated data (dedupe by id)
      const allEvents = [...KOREA_EVENTS];
      const existingIds = new Set(allEvents.map(e => e.id));
      for (const live of liveEvents) {
        if (!existingIds.has(live.id)) {
          allEvents.push(live);
        }
      }

      // Enrich with status
      let enriched = allEvents.map(enrichEvent);

      // Filter
      if (params?.category) {
        enriched = enriched.filter(e => e.category === params.category);
      }
      if (params?.month) {
        enriched = enriched.filter(e => {
          const m = new Date(e.startDate).getMonth() + 1;
          return m === params.month;
        });
      }
      if (params?.venue) {
        enriched = enriched.filter(e =>
          e.venue.toLowerCase().includes(params.venue!.toLowerCase())
        );
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        enriched = enriched.filter(e =>
          e.title.toLowerCase().includes(q) ||
          e.titleKo.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some(t => t.toLowerCase().includes(q))
        );
      }

      // Sort: ongoing first, then upcoming by date, then ended
      enriched.sort((a, b) => {
        const statusOrder: Record<EventStatus, number> = { ongoing: 0, upcoming: 1, ended: 2 };
        const sa = statusOrder[a.status || 'upcoming'];
        const sb = statusOrder[b.status || 'upcoming'];
        if (sa !== sb) return sa - sb;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });

      return enriched;
    },
    3600 // 1 hour cache
  );
}
