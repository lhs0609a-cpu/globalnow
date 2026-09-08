'use client';

import { useSyncExternalStore } from 'react';
import clsx from 'clsx';
import { useNews } from '@/hooks/useNews';
import { NewsCard } from './NewsCard';
import { FeedSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
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
let fallbackDensity: Density = 'edition';
function getDensity(): Density {
  try { const saved = localStorage.getItem(DENSITY_KEY); return saved === 'list' || saved === 'edition' ? saved : fallbackDensity; }
  catch { return fallbackDensity; }
}
function subscribeDensity(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('globalnow:density', callback);
  return () => { window.removeEventListener('storage', callback); window.removeEventListener('globalnow:density', callback); };
}

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
            't-meta inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 transition-colors',
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

export function NewsFeed({ category, search }: { category?: string; search?: string }) {
  const { items, total, isLoading, error, mode, updatedAt, hasMore, loadMore, retry } = useNews({
    category: category === 'all' ? undefined : category,
    search,
    limit: 10,
  });
  const density = useSyncExternalStore(subscribeDensity, getDensity, () => 'edition' as Density);

  const changeDensity = (v: Density) => {
    fallbackDensity = v;
    try {
      localStorage.setItem(DENSITY_KEY, v);
    } catch {
      /* 무시 */
    }
    window.dispatchEvent(new Event('globalnow:density'));
  };

  if (isLoading && items.length === 0) return <div role="status" aria-label="뉴스 불러오는 중"><FeedSkeleton /></div>;

  if (error && items.length === 0) return (
    <div className="surface space-y-4 p-7">
      <p role="alert" className="t-body text-slate-300">{error}</p>
      <button type="button" className="action-primary" onClick={retry}>다시 시도</button>
    </div>
  );

  if (!isLoading && items.length === 0) {
    return (
      <div className="surface pb-7 text-center">
        <div role="status"><EmptyState title={search ? '검색 결과가 없습니다' : '이 주제의 뉴스가 아직 없습니다'} description={search ? '짧은 키워드나 다른 표현으로 검색해 보세요.' : '다른 주제를 선택하거나 전체 뉴스를 확인해 보세요.'} /></div>
        <Link href="/" className="action-primary">전체 뉴스 보기</Link>
      </div>
    );
  }

  const editionMode = density === 'edition';
  const lead = editionMode ? items[0] : undefined;
  const secondary = editionMode ? items.slice(1, 3) : [];
  const rest = editionMode ? items.slice(3) : items;

  return (
    <div aria-busy={isLoading}>
      {mode === 'demo' && <p className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 t-meta text-amber-400">샘플 뉴스입니다. 실제 최신 뉴스와 다를 수 있습니다.</p>}
      {/* 피드 머리 — 건수와 밀도 선택 */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <p role="status" className="t-meta text-slate-500">
          <span className="tnum font-semibold text-slate-300">
            {total.toLocaleString('ko-KR')}
          </span>
          건 · 최신순
        </p>
        <DensityToggle value={density} onChange={changeDensity} />
      </div>

      <div>
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
      </div>
      <div className="mt-5 flex flex-col items-center gap-3 border-t border-line pt-5">
        {error && <p role="alert" className="t-body-sm text-red-400">{error}</p>}
        {error ? <button type="button" className="action-secondary" onClick={retry}>다시 시도</button> : hasMore ? (
          <button type="button" className="action-secondary w-full sm:w-auto sm:min-w-56" disabled={isLoading} onClick={loadMore}>
            {isLoading ? '불러오는 중…' : '뉴스 더 보기'}
          </button>
        ) : <p className="t-meta text-slate-500">현재 조건의 뉴스를 모두 확인했습니다.</p>}
        <p role="status" className="t-meta-sm text-slate-500">{items.length} / {total}건 표시{updatedAt ? ` · ${new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 조회` : ''}</p>
      </div>
    </div>
  );
}
