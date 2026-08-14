import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedJobRequest } from '@/lib/auth/verify-job-request';

export async function POST(request: NextRequest) {
  if (!isAuthorizedJobRequest(request)) {
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
