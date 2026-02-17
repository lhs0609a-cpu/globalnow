import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
