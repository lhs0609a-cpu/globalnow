import { NextRequest, NextResponse } from 'next/server';
import {
  getDirectory,
  getDirectoryGroupCounts,
  getDirectoryCountries,
  getDirectoryStats,
  getScopeCounts,
  isDirectoryGroupId,
  isDirectoryScope,
  isMediaLean,
} from '@/lib/services/source-directory-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const scopeParam = searchParams.get('scope');
    const group = searchParams.get('group') || undefined;
    const country = searchParams.get('country') || undefined;
    const search = searchParams.get('q') || undefined;
    const leanParam = searchParams.get('lean');
    const freeOnly = searchParams.get('free') === '1';

    if (scopeParam && !isDirectoryScope(scopeParam)) {
      return NextResponse.json({ error: 'scope는 kr 또는 global이어야 합니다' }, { status: 400 });
    }
    if (group && !isDirectoryGroupId(group)) {
      return NextResponse.json({ error: '알 수 없는 카테고리입니다' }, { status: 400 });
    }
    if (leanParam && !isMediaLean(leanParam)) {
      return NextResponse.json({ error: '알 수 없는 성향 값입니다' }, { status: 400 });
    }

    const scope = scopeParam && isDirectoryScope(scopeParam) ? scopeParam : undefined;
    const lean = leanParam && isMediaLean(leanParam) ? leanParam : undefined;

    const sections = getDirectory({ scope, group, country, search, freeOnly, lean });

    return NextResponse.json({
      sections,
      groups: getDirectoryGroupCounts(scope),
      countries: getDirectoryCountries(scope),
      stats: getDirectoryStats(scope),
      scopeCounts: getScopeCounts(),
    });
  } catch {
    return NextResponse.json({ error: '사이트 디렉토리를 불러올 수 없습니다' }, { status: 500 });
  }
}
