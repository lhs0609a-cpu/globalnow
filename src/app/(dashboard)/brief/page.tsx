'use client';

import { useState, useEffect } from 'react';
import { MorningBrief as MorningBriefType } from '@/types/news';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/AppShell';
import { Card, CardDivider } from '@/components/ui/Card';

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
            className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[0.8125rem] text-slate-100 transition-colors hover:border-white/[0.14] focus:border-blue-500/50 focus:outline-none"
          />
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-blue-500" />
        </div>
      ) : brief ? (
        <Card>
          <div className="px-6 py-5">
            <p className="text-[0.875rem] leading-relaxed text-slate-300">{brief.summary}</p>
          </div>
          <CardDivider />
          <div className="divide-y divide-white/[0.04]">
            {brief.items.map(item => (
              <div key={item.rank} className="group flex gap-4 px-6 py-5 transition-colors hover:bg-white/[0.02]">
                <span className="tnum flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-xs font-semibold text-slate-400">
                  {item.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant={item.impact === 'high' ? 'danger' : item.impact === 'medium' ? 'warning' : 'info'}>
                      {item.impact === 'high' ? '높음' : item.impact === 'medium' ? '보통' : '낮음'}
                    </Badge>
                    <span className="text-[0.6875rem] text-slate-500">{item.source}</span>
                    <span className="text-[0.6875rem] text-slate-600">·</span>
                    <span className="text-[0.6875rem] text-slate-500">{item.category}</span>
                  </div>
                  <h3 className="text-[0.9375rem] font-semibold leading-snug text-slate-100">
                    {item.titleKo}
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-slate-500">
                    {item.summaryKo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-slate-800 px-6 py-16 text-center">
          <p className="text-[0.875rem] font-medium text-slate-300">
            해당 날짜의 브리프가 없습니다
          </p>
          <p className="mt-1 text-[0.8125rem] text-slate-500">다른 날짜를 선택해보세요</p>
        </div>
      )}
    </div>
  );
}
