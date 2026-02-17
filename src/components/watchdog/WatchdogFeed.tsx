'use client';

import { WatchdogNewsItem } from '@/types/watchdog';
import { WatchdogCard } from './WatchdogCard';
import { Skeleton } from '@/components/ui/Skeleton';

type Props = {
  items: WatchdogNewsItem[];
  total: number;
  isLoading: boolean;
  isEmpty: boolean; // no tickers selected
};

function WatchdogSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex gap-3">
        <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-1">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function WatchdogFeed({ items, total, isLoading, isEmpty }: Props) {
  if (isEmpty) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🐕</div>
        <h3 className="text-white font-semibold mb-1">포트폴리오 워치독</h3>
        <p className="text-slate-400 text-sm">
          관심 종목을 추가하면 관련 뉴스를 실시간으로 모아드립니다
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <WatchdogSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">📭</div>
        <h3 className="text-white font-semibold mb-1">관련 뉴스가 없습니다</h3>
        <p className="text-slate-400 text-sm">
          선택한 종목에 대한 최신 뉴스가 아직 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          총 <span className="text-white font-medium">{total}</span>건의 관련 뉴스
        </p>
      </div>
      {items.map(item => (
        <WatchdogCard key={item.id} item={item} />
      ))}
    </div>
  );
}
