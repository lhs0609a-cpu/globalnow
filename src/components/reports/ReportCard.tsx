'use client';

import { WeeklyReport } from '@/types/report';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardDivider } from '@/components/ui/Card';

type Props = {
  report: WeeklyReport;
};

const impactVariant = {
  positive: 'success' as const,
  negative: 'danger' as const,
  neutral: 'default' as const,
};

const impactLabel = {
  positive: '긍정',
  negative: '부정',
  neutral: '중립',
};

/** 리포트 안의 소제목. 본문과 같은 크기로는 구간이 나뉘지 않는다. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </h3>
  );
}

export function ReportCard({ report }: Props) {
  const { content } = report;

  return (
    <Card>
      {/* Header */}
      <div className="px-6 py-5">
        <p className="tnum text-[0.6875rem] text-slate-500">
          {report.weekStart} — {report.weekEnd}
        </p>
        <h2 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight text-slate-100">
          {content.headline}
        </h2>
      </div>
      <CardDivider />

      <div className="space-y-6 px-6 py-5">
        {/* Top 3 Issues */}
        <div>
          <SectionLabel>핵심 이슈 3</SectionLabel>
          <div className="space-y-2">
            {content.topIssues.map((issue, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3.5"
              >
                <div className="mb-1.5 flex items-start justify-between gap-3">
                  <span className="text-[0.8125rem] font-medium leading-snug text-slate-100">
                    <span className="tnum mr-1.5 text-slate-600">{i + 1}</span>
                    {issue.title}
                  </span>
                  <Badge variant={impactVariant[issue.impact]}>
                    {impactLabel[issue.impact]}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">{issue.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Impact */}
        <div>
          <SectionLabel>시장 영향</SectionLabel>
          <p className="text-[0.8125rem] leading-relaxed text-slate-400">
            {content.marketImpact}
          </p>
        </div>

        {/* Outlook */}
        <div>
          <SectionLabel>전망</SectionLabel>
          <p className="text-[0.8125rem] leading-relaxed text-slate-400">
            {content.outlook}
          </p>
        </div>

        {/* Upcoming Events */}
        {content.upcomingEvents.length > 0 && (
          <div>
            <SectionLabel>주요 일정</SectionLabel>
            <ul className="space-y-1.5">
              {content.upcomingEvents.map((event, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-slate-400"
                >
                  <span className="mt-[0.4375rem] h-1 w-1 flex-shrink-0 rounded-full bg-blue-500" />
                  {event}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <CardDivider />
      <p className="px-6 py-3 text-[0.6875rem] text-slate-600">
        AI 생성 · {new Date(report.generatedAt).toLocaleString('ko-KR')}
      </p>
    </Card>
  );
}

export function ReportSkeleton() {
  return (
    <Card>
      <div className="space-y-2 px-6 py-5">
        <Skeleton className="h-2.5 w-40" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <CardDivider />
      <div className="space-y-6 px-6 py-5">
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-24" />
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="space-y-2 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3.5"
            >
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </Card>
  );
}
