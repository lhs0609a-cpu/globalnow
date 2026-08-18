'use client';

import { WatchdogNewsItem } from '@/types/watchdog';
import { WatchdogCard } from './WatchdogCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

type Props = {
  items: WatchdogNewsItem[];
  total: number;
  isLoading: boolean;
  isEmpty: boolean; // no tickers selected
};

function WatchdogSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-800 p-4">
      <div className="flex gap-3.5">
        <Skeleton className="h-16 w-16 flex-shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-1">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-14 rounded" />
          </div>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function WatchdogFeed({ items, total, isLoading, isEmpty }: Props) {
  if (isEmpty) {
    return (
      <EmptyState
        title="관심 종목을 추가해보세요"
        description="종목을 등록하면 관련 뉴스를 실시간으로 모아드립니다"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map(i => (
          <WatchdogSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="관련 뉴스가 없습니다"
        description="선택한 종목에 대한 최신 뉴스가 아직 없습니다"
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[0.8125rem] text-slate-500">
        총 <span className="tnum font-medium text-slate-200">{total}</span>건의 관련 뉴스
      </p>
      {items.map(item => (
        <WatchdogCard key={item.id} item={item} />
      ))}
    </div>
  );
}
