import { NextRequest, NextResponse } from 'next/server';
import { getSignals } from '@/lib/services/signal-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const type = searchParams.get('type') || undefined;
    const company = searchParams.get('company') || undefined;
    const significance = searchParams.get('significance') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await getSignals({
      type,
      company,
      significance,
      page: Math.max(1, page),
      limit: Math.min(50, Math.max(1, limit)),
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: '시그널을 불러올 수 없습니다' }, { status: 500 });
  }
}
