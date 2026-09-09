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
      .filter(t => /^(?:[A-Z]{1,5}(?:[.-][A-Z]{1,2})?|[0-9]{6})$/.test(t))
      .slice(0, 100);

    if (tickers.length === 0) {
      return NextResponse.json(
        { error: '영문 종목 코드 또는 국내 6자리 종목 코드를 입력해 주세요.' },
        { status: 400 }
      );
    }

    const page = Math.floor(Math.max(1, Math.min(100, Number(searchParams.get('page')) || 1)));
    const limit = Math.floor(Math.max(1, Math.min(50, Number(searchParams.get('limit')) || 20)));

    const result = await getWatchdogNews(tickers, page, limit);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: '워치독 뉴스를 불러올 수 없습니다' }, { status: 500 });
  }
}
