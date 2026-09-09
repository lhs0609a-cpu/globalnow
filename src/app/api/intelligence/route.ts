import { NextResponse } from 'next/server';
import { getNewsFeed } from '@/lib/services/news-service';
import { buildSnapshot } from '@/lib/intelligence/model';
import { cacheGetOrSet } from '@/lib/redis/cache';
export async function GET() {
  try {
    const snapshot = await cacheGetOrSet('intelligence:v1', async () => {
      const result = await getNewsFeed({ limit: 400, page: 1 });
      return buildSnapshot(result.items, result.mode, result.total);
    }, 60);
    return NextResponse.json(snapshot);
  } catch { return NextResponse.json({ error: '상황 데이터를 불러오지 못했습니다.' }, { status: 503 }); }
}
