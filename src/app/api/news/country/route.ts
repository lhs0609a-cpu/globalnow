import { NextRequest, NextResponse } from 'next/server';
import { getNewsByCountry } from '@/lib/services/news-service';
import { translateBatch } from '@/lib/ai/translate';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const limit = Math.max(1, Math.min(20, Number(searchParams.get('limit')) || 5));

    if (!country || country.length > 5) {
      return NextResponse.json({ error: 'country parameter required' }, { status: 400 });
    }

    const items = await getNewsByCountry(country.toUpperCase(), limit);

    // Try to translate titles
    const titlesNeedingTranslation = items
      .filter(item => !item.titleKo)
      .map(item => item.title);

    if (titlesNeedingTranslation.length > 0) {
      const translated = await translateBatch(titlesNeedingTranslation);
      let translatedIdx = 0;
      for (const item of items) {
        if (!item.titleKo && translatedIdx < translated.length) {
          // Only set titleKo if the translation is different from the original
          const t = translated[translatedIdx];
          if (t !== item.title) {
            item.titleKo = t;
          }
          translatedIdx++;
        }
      }
    }

    return NextResponse.json({ items, country });
  } catch {
    return NextResponse.json({ error: '뉴스를 불러올 수 없습니다' }, { status: 500 });
  }
}
