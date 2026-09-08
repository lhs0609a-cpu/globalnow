import { NextRequest, NextResponse } from 'next/server';
import { getBookmarks, toggleBookmark } from '@/lib/services/user-service';
import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getAuthUser } from '@/lib/auth/get-user';
import { getNewsById } from '@/lib/services/news-service';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const user = await getAuthUser();
    const bookmarks = await getBookmarks(user?.id);
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
    let storedNewsId = newsId;
    // RSS IDs are stable text identifiers; bookmarks reference persisted UUID news rows.
    if (newsId.startsWith('rss-')) {
      const news = await getNewsById(newsId);
      if (!news) return NextResponse.json({ error: '기사를 다시 불러온 뒤 저장해 주세요.' }, { status: 404 });
      const supabase = await createServiceRoleClient();
      if (!supabase) throw new Error('Storage unavailable');
      const { error: saveError } = await supabase.from('news').upsert({
        title: news.title, title_ko: news.titleKo, summary: news.summary, summary_ko: news.summaryKo,
        url: news.url, image_url: news.imageUrl, source_id: news.sourceId, category: news.category,
        country: news.country, published_at: news.publishedAt,
      }, { onConflict: 'url', ignoreDuplicates: true });
      if (saveError) throw saveError;
      const { data: stored, error: findError } = await supabase.from('news').select('id').eq('url', news.url).single();
      if (findError || !stored) throw findError || new Error('Article was not saved');
      storedNewsId = stored.id;
    }
    const bookmarked = await toggleBookmark(user.id, storedNewsId);
    return NextResponse.json({ success: true, bookmarked });
  } catch {
    return NextResponse.json({ error: '북마크 처리에 실패했습니다' }, { status: 500 });
  }
}
