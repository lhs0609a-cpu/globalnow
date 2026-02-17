import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { collectRedditPosts } = await import('@/lib/collectors/reddit-collector');
    const posts = await collectRedditPosts();

    return NextResponse.json({
      success: true,
      collected: posts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Reddit collection error:', error);
    return NextResponse.json({ error: 'Collection failed' }, { status: 500 });
  }
}
