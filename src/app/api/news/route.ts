import { NextRequest, NextResponse } from 'next/server';
import { getNewsFeed } from '@/lib/services/news-service';
import { NewsCategory } from '@/types/news';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      category: (searchParams.get('category') as NewsCategory) || undefined,
      country: searchParams.get('country') || undefined,
      source: searchParams.get('source') || undefined,
      page: Math.max(1, Math.min(100, Number(searchParams.get('page')) || 1)),
      limit: Math.max(1, Math.min(50, Number(searchParams.get('limit')) || 10)),
      sortBy: (searchParams.get('sortBy') as 'latest' | 'popular' | 'trending') || 'latest',
      search: searchParams.get('search')?.slice(0, 200)?.replace(/[%_]/g, '') || undefined,
    };
    const result = await getNewsFeed(params);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: '뉴스를 불러올 수 없습니다' }, { status: 500 });
  }
}
