import { NextRequest, NextResponse } from 'next/server';
import { getAlerts } from '@/lib/services/user-service';
import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getAuthUser } from '@/lib/auth/get-user';

export async function GET() {
  try {
    const alerts = await getAlerts();
    return NextResponse.json(alerts);
  } catch {
    return NextResponse.json({ error: '알림을 불러올 수 없습니다' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (isDemoMode()) {
      return NextResponse.json({ success: true, id: 'new-alert' });
    }
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }
    const { keyword } = await request.json();
    if (!keyword || typeof keyword !== 'string' || keyword.length > 100) {
      return NextResponse.json({ error: '잘못된 키워드입니다' }, { status: 400 });
    }
    return NextResponse.json({ success: true, id: 'new-alert', keyword });
  } catch {
    return NextResponse.json({ error: '알림 등록에 실패했습니다' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (isDemoMode()) {
      return NextResponse.json({ success: true });
    }
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }
    const { id } = await request.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    return NextResponse.json({ success: true, deleted: id });
  } catch {
    return NextResponse.json({ error: '알림 삭제에 실패했습니다' }, { status: 500 });
  }
}
