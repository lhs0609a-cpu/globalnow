import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/demo/is-demo-mode';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json({ success: true, message: 'Demo mode - newsletter skipped' });
  }

  try {
    // 1. Get today's brief
    // 2. Get subscribed users
    // 3. Send via Resend API

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}
