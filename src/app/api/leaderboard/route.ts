import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/services/prediction-service';

export async function GET() {
  try {
    const leaderboard = await getLeaderboard();
    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json({ error: '리더보드를 불러올 수 없습니다' }, { status: 500 });
  }
}
