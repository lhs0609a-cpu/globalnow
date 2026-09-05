'use client';

import { useState, useEffect } from 'react';
import { MorningBrief as MorningBriefType } from '@/types/news';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/AppShell';
import { Card, CardDivider } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Skeleton';

export default function BriefPage() {
  const [brief, setBrief] = useState<MorningBriefType | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/brief/${selectedDate}`);
        const data = await res.json();
        setBrief(data);
      } catch (error) {
        console.error('Failed to fetch brief:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBrief();
  }, [selectedDate]);

  return (
    <div>
      <PageHeader
        title="모닝 브리프"
        description="매일 아침 꼭 알아야 할 글로벌 뉴스"
        action={
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            aria-label="날짜 선택"
            className="h-9 rounded-lg border border-line-strong bg-fill-subtle px-3 text-[0.875rem] text-slate-100 transition-colors hover:border-line-strong focus:border-blue-500/50 focus:outline-none"
          />
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : brief ? (
        <Card>
          <div className="px-6 py-5">
            <p className="t-body text-slate-300">{brief.summary}</p>
          </div>
          <CardDivider />
          <div className="divide-y divide-line">
            {brief.items.map(item => (
              <div key={item.rank} className="group flex gap-4 px-6 py-5 transition-colors hover:bg-fill-subtle">
                <span className="tnum flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-fill-weak t-body-sm font-semibold text-slate-400">
                  {item.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant={item.impact === 'high' ? 'danger' : item.impact === 'medium' ? 'warning' : 'info'}>
                      {item.impact === 'high' ? '높음' : item.impact === 'medium' ? '보통' : '낮음'}
                    </Badge>
                    <span className="t-meta-sm text-slate-500">{item.source}</span>
                    <span className="t-meta-sm text-slate-600">·</span>
                    <span className="t-meta-sm text-slate-500">{item.category}</span>
                  </div>
                  <h3 className="t-headline-sm text-slate-100">
                    {item.titleKo}
                  </h3>
                  <p className="mt-1.5 t-body-sm text-slate-500">
                    {item.summaryKo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="surface px-6 py-16 text-center">
          <p className="t-body font-medium text-slate-300">
            해당 날짜의 브리프가 없습니다
          </p>
          <p className="mt-1 t-body-sm text-slate-500">다른 날짜를 선택해보세요</p>
        </div>
      )}
    </div>
  );
}
