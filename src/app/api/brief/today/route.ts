import { NextResponse } from 'next/server';
import { getTodayBrief } from '@/lib/services/brief-service';

export async function GET() {
  try {
    const brief = await getTodayBrief();
    return NextResponse.json(brief);
  } catch {
    return NextResponse.json({ error: '브리프를 불러올 수 없습니다' }, { status: 500 });
  }
}
