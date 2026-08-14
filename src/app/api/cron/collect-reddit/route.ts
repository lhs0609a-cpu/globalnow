import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedJobRequest } from '@/lib/auth/verify-job-request';

export async function POST(request: NextRequest) {
  if (!isAuthorizedJobRequest(request)) {
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
