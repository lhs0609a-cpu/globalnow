import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { collectHackerNews } = await import('@/lib/collectors/hn-collector');
    const stories = await collectHackerNews();

    return NextResponse.json({
      success: true,
      collected: stories.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('HN collection error:', error);
    return NextResponse.json({ error: 'Collection failed' }, { status: 500 });
  }
}
