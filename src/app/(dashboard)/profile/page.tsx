'use client';

import { useState, useEffect } from 'react';
import { UserStreak, NewsDNA } from '@/types/user';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/AppShell';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Skeleton';

/** 숫자 하나를 강조하는 통계 칸 */
function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="bg-surface px-5 py-4 text-center">
      <p className="tnum t-headline-xl tracking-tight text-slate-100">{value}</p>
      <p className="mt-0.5 t-meta-sm text-slate-500">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [dna, setDna] = useState<NewsDNA | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [streakRes, dnaRes] = await Promise.all([
          fetch('/api/user/streak').then(r => r.json()),
          fetch('/api/user/dna').then(r => r.json()),
        ]);
        setStreak(streakRes);
        setDna(dnaRes);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="마이페이지" description="읽기 습관과 관심사를 한눈에 봅니다" />

      <div className="space-y-5">
        {/* Streak */}
        {streak && (
          <Card>
            <div className="flex items-center gap-3.5 px-5 py-5">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                <Icon name="flame" className="h-5 w-5" />
              </span>
              <div>
                <p className="tnum t-headline-xl tracking-tight text-slate-100">
                  {streak.currentStreak}일
                </p>
                <p className="t-body-sm text-slate-500">연속 방문 스트릭</p>
              </div>
            </div>
            <CardDivider />

            <div className="grid grid-cols-3 gap-px bg-fill-weak">
              <Stat value={streak.longestStreak} label="최장 스트릭" />
              <Stat value={streak.badges.length} label="획득 배지" />
              <Stat value={streak.todayRead ? '완료' : '미완'} label="오늘 방문" />
            </div>

            {/* Badges */}
            {streak.badges.length > 0 && (
              <>
                <CardDivider />
                <div className="flex flex-wrap gap-1.5 px-5 py-4">
                  {streak.badges.map(badge => (
                    <span
                      key={badge.id}
                      className="flex items-center gap-1.5 rounded-md border border-line bg-fill-subtle px-2.5 py-1"
                    >
                      <span className="t-body-sm leading-none">{badge.icon}</span>
                      <span className="t-meta-sm font-medium text-slate-300">
                        {badge.nameKo}
                      </span>
                    </span>
                  ))}
                </div>
              </>
            )}
          </Card>
        )}

        {/* News DNA */}
        {dna && (
          <Card>
            <CardHeader title="뉴스 DNA" description="무엇을 얼마나 읽었는지" icon="chart" />
            <CardDivider />

            <div className="grid grid-cols-1 gap-8 px-5 py-5 md:grid-cols-2">
              {/* Category distribution */}
              <div>
                <h3 className="mb-3 t-meta-sm font-semibold uppercase tracking-wider text-slate-500">
                  카테고리 분포
                </h3>
                <div className="space-y-2.5">
                  {dna.categoryDistribution.map(cat => (
                    <div key={cat.category}>
                      <div className="mb-1.5 flex justify-between t-body-sm">
                        <span className="text-slate-300">{cat.category}</span>
                        <span className="tnum text-slate-500">{cat.percentage}%</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-fill">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-[width] duration-500"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Keywords */}
              <div>
                <h3 className="mb-3 t-meta-sm font-semibold uppercase tracking-wider text-slate-500">
                  관심 키워드 TOP 5
                </h3>
                <div className="space-y-1">
                  {dna.topKeywords.map((kw, i) => (
                    <div
                      key={kw.keyword}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-fill-subtle"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="tnum w-3 t-meta-sm text-slate-600">{i + 1}</span>
                        <span className="t-body-sm text-slate-200">{kw.keyword}</span>
                      </div>
                      <Badge variant="info">{kw.count}회</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <CardDivider />
            <div className="grid grid-cols-2 gap-px bg-fill-weak">
              <Stat value={dna.totalReads} label="총 읽은 기사" />
              <Stat value={`${dna.avgReadTime}분`} label="평균 읽기 시간" />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
