import { NextRequest, NextResponse } from 'next/server';
import { getBookmarks, toggleBookmark } from '@/lib/services/user-service';
import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getAuthUser } from '@/lib/auth/get-user';

export async function GET() {
  try {
    const bookmarks = await getBookmarks();
    return NextResponse.json(bookmarks);
  } catch {
    return NextResponse.json({ error: '북마크를 불러올 수 없습니다' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (isDemoMode()) {
      return NextResponse.json({ success: true, bookmarked: true });
    }
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }
    const { newsId } = await request.json();
    if (!newsId || typeof newsId !== 'string') {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
    }
    const bookmarked = await toggleBookmark(user.id, newsId);
    return NextResponse.json({ success: true, bookmarked });
  } catch {
    return NextResponse.json({ error: '북마크 처리에 실패했습니다' }, { status: 500 });
  }
}
