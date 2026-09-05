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

/**
 * 모닝 브리프.
 *
 * 화면 맨 위에 놓이는 유일한 "읽는 글"이다. 나머지가 목록·수치인 만큼
 * 여기만 본문 활자(17px/1.72)를 크게 쓰고, 순번은 신문 사설의 항목 번호처럼
 * 세리프 숫자로 세워 기사 목록과 성격을 갈라 놓는다.
 */
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
      <div className="flex items-center justify-between gap-4 px-5 py-3.5">
        <button
          type="button"
          onClick={() => setIsExpanded(v => !v)}
          aria-expanded={isExpanded}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <Icon name="brief" className="h-4 w-4 flex-shrink-0 text-amber-400" />
          <div className="min-w-0">
            <h2 className="t-title text-slate-100">모닝 브리프</h2>
          </div>
          <span className="t-meta-sm truncate font-normal text-slate-500">
            오늘 꼭 알아야 할 5가지
          </span>
          <Icon
            name="chevronDown"
            className={`ml-auto h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <Link
          href="/brief"
          className="t-meta flex flex-shrink-0 items-center gap-0.5 rounded-md px-2 py-1 text-slate-400 transition-colors hover:bg-fill-weak hover:text-slate-100"
        >
          아카이브
          <Icon name="chevronRight" className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isExpanded && (
        <>
          <CardDivider />
          <div className="px-5 py-5">
            {/* 요약은 리드문이다 — 상자에 가두지 않고 왼쪽 괘선만 세운다 */}
            <p className="t-body-lg border-l-2 border-accent pl-4 text-slate-200">
              {brief.summary}
            </p>

            <ol className="mt-4 divide-y divide-line">
              {brief.items.map(item => (
                <li key={item.rank} className="group flex gap-4 py-3.5">
                  <span
                    aria-hidden
                    className="t-editorial tnum mt-0.5 w-5 flex-shrink-0 text-right text-[1.125rem] font-medium leading-none text-slate-600"
                  >
                    {item.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <Badge variant={impactColors[item.impact]}>
                        {impactLabels[item.impact]}
                      </Badge>
                      <span className="t-meta-sm truncate font-normal text-slate-500">
                        {item.source}
                      </span>
                    </div>
                    <h3 className="t-headline-sm text-slate-100">{item.titleKo}</h3>
                    <p className="t-body-sm mt-1 line-clamp-2 text-slate-500">
                      {item.summaryKo}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </Card>
  );
}
