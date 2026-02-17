import { NextResponse } from 'next/server';
import { getUserStreak } from '@/lib/services/user-service';

export async function GET() {
  try {
    const streak = await getUserStreak();
    return NextResponse.json(streak);
  } catch {
    return NextResponse.json({ error: '스트릭을 불러올 수 없습니다' }, { status: 500 });
  }
}
