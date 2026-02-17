'use client';

import { useNews } from '@/hooks/useNews';
import { NewsCard } from './NewsCard';
import { NewsCardSkeleton } from '@/components/ui/Skeleton';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';

export function NewsFeed({ category }: { category?: string }) {
  const { items, isLoading, hasMore, loadMore } = useNews({ category: category === 'all' ? undefined : category });

  if (isLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-12 text-center">
        <span className="text-4xl block mb-3">📰</span>
        <p className="text-slate-400">해당 카테고리의 뉴스가 없습니다</p>
        <p className="text-slate-500 text-sm mt-1">다른 카테고리를 선택해보세요</p>
      </div>
    );
  }

  return (
    <InfiniteScroll hasMore={hasMore} isLoading={isLoading} onLoadMore={loadMore}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(news => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
