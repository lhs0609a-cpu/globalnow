'use client';

import { useNews } from '@/hooks/useNews';
import { NewsCard } from './NewsCard';
import { NewsCardSkeleton } from '@/components/ui/Skeleton';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';

export function NewsFeed({ category }: { category?: string }) {
  const { items, isLoading, hasMore, loadMore } = useNews({ category: category === 'all' ? undefined : category });

  if (isLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-slate-800 px-6 py-16 text-center">
        <p className="text-[0.875rem] font-medium text-slate-300">
          해당 카테고리의 뉴스가 없습니다
        </p>
        <p className="mt-1 text-[0.8125rem] text-slate-500">
          다른 카테고리를 선택해보세요
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll hasMore={hasMore} isLoading={isLoading} onLoadMore={loadMore}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map(news => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
