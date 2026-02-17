import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { collectRSSFeeds } = await import('@/lib/collectors/rss-collector');
    const articles = await collectRSSFeeds();

    // In production, save to Supabase
    return NextResponse.json({
      success: true,
      collected: articles.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('RSS collection error:', error);
    return NextResponse.json({ error: 'Collection failed' }, { status: 500 });
  }
}
