import { NextResponse } from 'next/server';
import { cacheGetOrSet } from '@/lib/redis/cache';

const MOCK_SENTIMENT = [
  { country: 'US', sentiment: 0.2, topTopic: 'AI', articleCount: 1250 },
  { country: 'UK', sentiment: -0.1, topTopic: 'Elections', articleCount: 890 },
  { country: 'CN', sentiment: -0.3, topTopic: 'Economy', articleCount: 2100 },
  { country: 'JP', sentiment: 0.4, topTopic: 'Semiconductors', articleCount: 670 },
  { country: 'DE', sentiment: -0.2, topTopic: 'Energy', articleCount: 540 },
  { country: 'KR', sentiment: 0.1, topTopic: 'Tech', articleCount: 480 },
  { country: 'FR', sentiment: -0.15, topTopic: 'Politics', articleCount: 420 },
  { country: 'IN', sentiment: 0.3, topTopic: 'Tech', articleCount: 750 },
  { country: 'BR', sentiment: -0.1, topTopic: 'Economy', articleCount: 320 },
  { country: 'AU', sentiment: 0.05, topTopic: 'Mining', articleCount: 280 },
];

export async function GET() {
  try {
    const data = await cacheGetOrSet(
      'sentiment:map',
      async () => {
        // Always try GDELT first
        try {
          const { collectSentimentMap } = await import('@/lib/collectors/gdelt-collector');
          const liveData = await collectSentimentMap();

          if (liveData.length > 0) {
            console.log(`[Sentiment] GDELT returned ${liveData.length} countries`);
            return { data: liveData, isLive: true };
          }
        } catch (error) {
          console.error('GDELT sentiment collection failed:', error);
        }

        // Fallback to mock
        return { data: MOCK_SENTIMENT, isLive: false };
      },
      300
    );

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ data: MOCK_SENTIMENT, isLive: false });
  }
}
