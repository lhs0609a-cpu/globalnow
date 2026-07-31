import { NextRequest, NextResponse } from 'next/server';
import { getRankedSources, getAvailableCountries } from '@/lib/services/media-ranking-service';
import { MediaTier } from '@/lib/constants/media-rankings';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tierParam = searchParams.get('tier');
    const country = searchParams.get('country') || undefined;

    // Validate tier range (1-3)
    let tier: MediaTier | undefined;
    if (tierParam) {
      const tierNum = parseInt(tierParam);
      if (isNaN(tierNum) || tierNum < 1 || tierNum > 3) {
        return NextResponse.json(
          { error: 'tier는 1-3 사이의 값이어야 합니다' },
          { status: 400 }
        );
      }
      tier = tierNum as MediaTier;
    }

    const sources = getRankedSources(tier, country);
    const countries = getAvailableCountries();

    return NextResponse.json({ sources, countries });
  } catch {
    return NextResponse.json({ error: '소스 랭킹을 불러올 수 없습니다' }, { status: 500 });
  }
}
