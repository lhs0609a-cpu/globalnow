import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedJobRequest } from '@/lib/auth/verify-job-request';

export async function POST(request: NextRequest) {
  if (!isAuthorizedJobRequest(request)) {
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
