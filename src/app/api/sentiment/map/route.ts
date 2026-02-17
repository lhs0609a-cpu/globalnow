import { NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/demo/is-demo-mode';

const MOCK_SENTIMENT = [
  { country: 'US', sentiment: 0.2, topTopic: 'AI', articleCount: 1250 },
  { country: 'UK', sentiment: -0.1, topTopic: 'Elections', articleCount: 890 },
  { country: 'CN', sentiment: -0.3, topTopic: 'Economy', articleCount: 2100 },
  { country: 'JP', sentiment: 0.4, topTopic: 'Semiconductors', articleCount: 670 },
  { country: 'DE', sentiment: -0.2, topTopic: 'Energy', articleCount: 540 },
];

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json(MOCK_SENTIMENT);
  }

  return NextResponse.json(MOCK_SENTIMENT);
}
