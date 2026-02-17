import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { collectMarketData } = await import('@/lib/collectors/market-collector');
    const data = await collectMarketData();

    return NextResponse.json({
      success: true,
      crypto: data.crypto.length,
      indices: data.indices.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Market collection error:', error);
    return NextResponse.json({ error: 'Collection failed' }, { status: 500 });
  }
}
