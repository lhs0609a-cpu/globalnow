'use client';

import { WeeklyReport } from '@/types/report';
import { getIndustry } from '@/lib/constants/industries';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

type Props = {
  report: WeeklyReport;
};

const impactVariant = {
  positive: 'success' as const,
  negative: 'danger' as const,
  neutral: 'default' as const,
};

const impactLabel = {
  positive: 'Positive',
  negative: 'Negative',
  neutral: 'Neutral',
};

export function ReportCard({ report }: Props) {
  const industry = getIndustry(report.industry);
  const { content } = report;

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-5 border border-slate-700/50">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{industry?.icon}</span>
          <span className="text-slate-400 text-sm">
            {report.weekStart} ~ {report.weekEnd}
          </span>
        </div>
        <h2 className="text-white text-lg font-bold leading-snug">
          {content.headline}
        </h2>
      </div>

      {/* Top 3 Issues */}
      <div className="space-y-3">
        <h3 className="text-slate-300 text-sm font-semibold">TOP 3 Issues</h3>
        {content.topIssues.map((issue, i) => (
          <div key={i} className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-white text-sm font-medium">
                {i + 1}. {issue.title}
              </span>
              <Badge variant={impactVariant[issue.impact]}>
                {impactLabel[issue.impact]}
              </Badge>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {issue.summary}
            </p>
          </div>
        ))}
      </div>

      {/* Market Impact */}
      <div>
        <h3 className="text-slate-300 text-sm font-semibold mb-2">시장 영향</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{content.marketImpact}</p>
      </div>

      {/* Outlook */}
      <div>
        <h3 className="text-slate-300 text-sm font-semibold mb-2">전망</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{content.outlook}</p>
      </div>

      {/* Upcoming Events */}
      {content.upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-slate-300 text-sm font-semibold mb-2">주요 일정</h3>
          <ul className="space-y-1">
            {content.upcomingEvents.map((event, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                <span className="text-blue-400">-</span>
                {event}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Generated timestamp */}
      <div className="pt-2 border-t border-slate-700/50">
        <p className="text-slate-500 text-xs">
          AI 생성: {new Date(report.generatedAt).toLocaleString('ko-KR')}
        </p>
      </div>
    </div>
  );
}

export function ReportSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-5 border border-slate-700/50">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-700/30 rounded-lg p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}
