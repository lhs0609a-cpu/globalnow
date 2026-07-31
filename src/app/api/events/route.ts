import { NextRequest, NextResponse } from 'next/server';
import { getKoreaEvents } from '@/lib/services/event-service';
import { EventCategory } from '@/types/event';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = (searchParams.get('category') as EventCategory) || undefined;
    const monthStr = searchParams.get('month');
    const venue = searchParams.get('venue') || undefined;
    const search = searchParams.get('search') || undefined;

    // Validate month range (1-12)
    let month: number | undefined;
    if (monthStr) {
      month = parseInt(monthStr);
      if (isNaN(month) || month < 1 || month > 12) {
        return NextResponse.json(
          { error: 'month는 1-12 사이의 값이어야 합니다' },
          { status: 400 }
        );
      }
    }

    const events = await getKoreaEvents({ category, month, venue, search });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: '이벤트를 불러올 수 없습니다' }, { status: 500 });
  }
}
