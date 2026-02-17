import { NextResponse } from 'next/server';
import { getTrending } from '@/lib/services/news-service';

export async function GET() {
  try {
    const items = await getTrending();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: '트렌딩을 불러올 수 없습니다' }, { status: 500 });
  }
}
