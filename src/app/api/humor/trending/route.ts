import { NextResponse } from 'next/server';
import { getTrendingHumor } from '@/lib/services/humor-service';

export async function GET() {
  try {
    const items = await getTrendingHumor();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: '트렌딩 유머를 불러올 수 없습니다' }, { status: 500 });
  }
}
