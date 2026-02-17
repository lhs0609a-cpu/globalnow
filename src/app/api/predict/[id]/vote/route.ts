import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getAuthUser } from '@/lib/auth/get-user';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (isDemoMode()) {
      return NextResponse.json({ success: true, predictionId: id });
    }
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }
    const { choice } = await request.json();
    if (!choice || !['a', 'b'].includes(choice)) {
      return NextResponse.json({ error: '잘못된 선택입니다' }, { status: 400 });
    }
    return NextResponse.json({ success: true, predictionId: id, choice });
  } catch {
    return NextResponse.json({ error: '투표 처리에 실패했습니다' }, { status: 500 });
  }
}
