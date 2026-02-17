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
      .map(t => t.trim())
      .filter(Boolean)
      .slice(0, 20); // max 20 tickers

    const page = Math.max(1, Math.min(100, Number(searchParams.get('page')) || 1));
    const limit = Math.max(1, Math.min(50, Number(searchParams.get('limit')) || 20));

    const result = await getWatchdogNews(tickers, page, limit);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: '워치독 뉴스를 불러올 수 없습니다' }, { status: 500 });
  }
}
