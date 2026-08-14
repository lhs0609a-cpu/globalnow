import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedJobRequest } from '@/lib/auth/verify-job-request';

export async function POST(request: NextRequest) {
  if (!isAuthorizedJobRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { collectHumor } = await import('@/lib/collectors/humor-collector');
    const items = await collectHumor();

    return NextResponse.json({
      success: true,
      collected: items.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Humor collection error:', error);
    return NextResponse.json({ error: 'Collection failed' }, { status: 500 });
  }
}
