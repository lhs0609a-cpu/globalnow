'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useNews } from '@/hooks/useNews';
import { NewsCard } from './NewsCard';
import { FeedSkeleton } from '@/components/ui/Skeleton';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';

/**
 * 뉴스 피드.
 *
 * 이전에는 모든 기사를 같은 크기의 카드 2단으로 깔았다. 그러면 한 화면에
 * 4~6건이 들어가고, 그중 무엇이 오늘의 큰 뉴스인지 알 수 없다.
 * 지면 편집처럼 위계를 준다 — 머리기사 1건, 중간기사 4건, 나머지는 단신 목록.
 * 단신은 카드 상자를 없애고 괘선으로만 나눠 한 화면에 10건 이상 들어간다.
 *
 * 밀도는 취향이 갈려서 「지면 / 목록」 두 가지를 두고 선택을 기억해 둔다.
 */

type Density = 'edition' | 'list';
const DENSITY_KEY = 'gn-feed-density';

function DensityToggle({
  value,
  onChange,
}: {
  value: Density;
  onChange: (v: Density) => void;
}) {
  const options: { id: Density; label: string; icon: 'dashboard' | 'menu' }[] = [
    { id: 'edition', label: '지면', icon: 'dashboard' },
    { id: 'list', label: '목록', icon: 'menu' },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-fill-subtle p-0.5">
      {options.map(o => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={clsx(
            't-meta-sm inline-flex h-7 items-center gap-1.5 rounded-[0.4375rem] px-2.5 transition-colors',
            value === o.id
              ? 'bg-fill text-slate-100'
              : 'text-slate-500 hover:text-slate-300'
          )}
        >
          <Icon name={o.icon} className="h-3.5 w-3.5" />
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function NewsFeed({ category }: { category?: string }) {
  const { items, total, isLoading, hasMore, loadMore } = useNews({
    category: category === 'all' ? undefined : category,
  });
  const [density, setDensity] = useState<Density>('edition');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DENSITY_KEY);
      if (saved === 'edition' || saved === 'list') setDensity(saved);
    } catch {
      /* 저장소를 막아둔 브라우저에서는 기본값으로 둔다 */
    }
  }, []);

  const changeDensity = (v: Density) => {
    setDensity(v);
    try {
      localStorage.setItem(DENSITY_KEY, v);
    } catch {
      /* 무시 */
    }
  };

  if (isLoading && items.length === 0) return <FeedSkeleton />;

  if (!isLoading && items.length === 0) {
    return (
      <EmptyState
        title="해당 카테고리의 뉴스가 없습니다"
        description="다른 카테고리를 선택하거나 잠시 후 다시 확인해 주세요"
      />
    );
  }

  const editionMode = density === 'edition';
  const lead = editionMode ? items[0] : undefined;
  const secondary = editionMode ? items.slice(1, 5) : [];
  const rest = editionMode ? items.slice(5) : items;

  return (
    <div>
      {/* 피드 머리 — 건수와 밀도 선택 */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="t-meta-sm text-slate-500">
          <span className="tnum font-semibold text-slate-300">
            {(total || items.length).toLocaleString('ko-KR')}
          </span>
          건 · 최신순
        </p>
        <DensityToggle value={density} onChange={changeDensity} />
      </div>

      <InfiniteScroll hasMore={hasMore} isLoading={isLoading} onLoadMore={loadMore}>
        {lead && (
          <div className="mb-7 border-b border-line pb-7">
            <NewsCard news={lead} variant="lead" />
          </div>
        )}

        {secondary.length > 0 && (
          <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
            {secondary.map(news => (
              <NewsCard key={news.id} news={news} variant="card" />
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className="divide-y divide-line border-t border-line">
            {rest.map(news => (
              <NewsCard key={news.id} news={news} variant="row" />
            ))}
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
