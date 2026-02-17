import { NextResponse } from 'next/server';
import { getMarketData } from '@/lib/services/market-service';

export async function GET() {
  try {
    const data = await getMarketData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: '시장 데이터를 불러올 수 없습니다' }, { status: 500 });
  }
}
