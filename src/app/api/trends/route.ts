import { NextRequest, NextResponse } from 'next/server';
import { getTrending } from '@/lib/services/news-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const source = searchParams.get('source') || undefined;
    const region = searchParams.get('region') || undefined;
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit')) || 50));

    const items = await getTrending(source, region);

    // Apply pagination
    const total = items.length;
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);

    return NextResponse.json({
      items: paginated,
      total,
      page,
      limit,
      hasMore: start + limit < total,
    });
  } catch {
    return NextResponse.json({ error: '트렌딩을 불러올 수 없습니다' }, { status: 500 });
  }
}
