import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/demo/is-demo-mode';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json({ success: true, message: 'Demo mode - brief generation skipped' });
  }

  try {
    // 1. Fetch last 12 hours of news
    // 2. Use Groq/Gemini to select top 5
    // 3. Generate Korean summaries
    // 4. Save to morning_briefs table

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Brief generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
