import { NextRequest, NextResponse } from 'next/server';
import { getLatestReport, getReportByWeek } from '@/lib/services/report-service';
import { IndustryId } from '@/types/report';

const VALID_INDUSTRIES: IndustryId[] = [
  'semiconductor', 'ai', 'battery', 'ev', 'fintech', 'bio', 'energy', 'defense', 'cloud',
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const industry = searchParams.get('industry') as IndustryId | null;
    const weekStart = searchParams.get('weekStart');

    if (!industry || !VALID_INDUSTRIES.includes(industry)) {
      return NextResponse.json({ error: '유효한 산업을 선택해주세요' }, { status: 400 });
    }

    const report = weekStart
      ? await getReportByWeek(industry, weekStart)
      : await getLatestReport(industry);

    if (!report) {
      return NextResponse.json({ error: '해당 리포트를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: '리포트를 불러올 수 없습니다' }, { status: 500 });
  }
}
