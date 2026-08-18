'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MorningBrief as MorningBriefType } from '@/types/news';
import { BriefSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Card, CardDivider } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const impactColors = {
  high: 'danger' as const,
  medium: 'warning' as const,
  low: 'info' as const,
};

const impactLabels = {
  high: '높음',
  medium: '보통',
  low: '낮음',
};

export function MorningBrief() {
  const [brief, setBrief] = useState<MorningBriefType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      try {
        const res = await fetch('/api/brief/today');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (data && Array.isArray(data.items)) {
          setBrief(data);
        }
      } catch (error) {
        console.error('Failed to fetch brief:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBrief();
  }, []);

  if (isLoading) return <BriefSkeleton />;
  if (!brief) return null;

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <button
          type="button"
          onClick={() => setIsExpanded(v => !v)}
          aria-expanded={isExpanded}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
            <Icon name="brief" className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[0.9375rem] font-semibold text-slate-100">모닝 브리프</h2>
            <p className="mt-0.5 text-xs text-slate-500">오늘 꼭 알아야 할 5가지</p>
          </div>
          <Icon
            name="chevronDown"
            className={`ml-1 h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <Link
          href="/brief"
          className="flex flex-shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-100"
        >
          아카이브
          <Icon name="chevronRight" className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          <CardDivider />
          <div className="px-5 py-4">
            <p className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3.5 text-[0.8125rem] leading-relaxed text-slate-300">
              {brief.summary}
            </p>

            <div className="mt-2">
              {brief.items.map(item => (
                <div
                  key={item.rank}
                  className="group -mx-2 flex gap-3.5 rounded-lg px-2 py-3 transition-colors hover:bg-white/[0.025]"
                >
                  <span className="tnum mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-[0.6875rem] font-semibold text-slate-400">
                    {item.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <Badge variant={impactColors[item.impact]}>
                        {impactLabels[item.impact]}
                      </Badge>
                      <span className="truncate text-[0.6875rem] text-slate-500">
                        {item.source}
                      </span>
                    </div>
                    <h3 className="text-[0.875rem] font-medium leading-snug text-slate-100 transition-colors group-hover:text-blue-400">
                      {item.titleKo}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {item.summaryKo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
