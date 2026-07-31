import { NextRequest, NextResponse } from 'next/server';
import { getWatchdogNews } from '@/lib/services/watchdog-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tickersParam = searchParams.get('tickers');

    if (!tickersParam) {
      return NextResponse.json({ items: [], total: 0, page: 1, limit: 20 });
    }

    const tickers = tickersParam
      .split(',')
      .map(t => t.trim().toUpperCase())  // Normalize to uppercase
      .filter(t => /^[A-Z]{1,5}$/.test(t))  // Only valid ticker format (1-5 uppercase letters)
      .slice(0, 20); // max 20 tickers

    if (tickers.length === 0) {
      return NextResponse.json(
        { error: '유효한 티커 형식이 아닙니다 (1-5자 영문 대문자)' },
        { status: 400 }
      );
    }

    const page = Math.max(1, Math.min(100, Number(searchParams.get('page')) || 1));
    const limit = Math.max(1, Math.min(50, Number(searchParams.get('limit')) || 20));

    const result = await getWatchdogNews(tickers, page, limit);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: '워치독 뉴스를 불러올 수 없습니다' }, { status: 500 });
  }
}
