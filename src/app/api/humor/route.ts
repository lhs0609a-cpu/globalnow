import { NextRequest, NextResponse } from 'next/server';
import { getHumorFeed } from '@/lib/services/humor-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || undefined;
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Math.min(50, Number(searchParams.get('limit')) || 10));
    const result = await getHumorFeed(type, page, limit);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: '유머를 불러올 수 없습니다' }, { status: 500 });
  }
}
