'use client';

import { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { TrendingItem } from '@/types/news';
import { COMMUNITY_SOURCES, REGION_FILTERS, getSourcesByRegion } from '@/lib/constants/communities';
import { formatNumber } from '@/lib/utils/format';
import { formatRelativeTime } from '@/lib/utils/date';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';

/** 필터 칩: 지역과 출처 두 줄이 같은 모양이어야 층위가 읽힌다 */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        't-meta-sm h-7 flex-shrink-0 whitespace-nowrap rounded-full px-2.5 transition-colors',
        active
          ? 'bg-fill text-slate-100'
          : 'text-slate-500 hover:bg-fill-weak hover:text-slate-300'
      )}
    >
      {children}
    </button>
  );
}

export function TrendingBar() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [activeRegion, setActiveRegion] = useState('all');
  const [activeSource, setActiveSource] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const sourceTabs = useMemo(() => {
    const sources = getSourcesByRegion(activeRegion);
    return [
      { id: 'all', label: '전체', icon: '' },
      ...sources.map(s => ({ id: s.id, label: s.nameKo, icon: s.icon })),
    ];
  }, [activeRegion]);

  useEffect(() => {
    async function fetchTrending() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeRegion !== 'all') params.set('region', activeRegion);
        if (activeSource !== 'all') params.set('source', activeSource);
        const url = `/api/trends${params.toString() ? '?' + params.toString() : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : (data.items || []));
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrending();
  }, [activeRegion, activeSource]);

  // 지역을 바꾸면 그 지역에 없는 출처가 남아 목록이 비어 보인다
  useEffect(() => {
    setActiveSource('all');
  }, [activeRegion]);

  const filtered =
    activeSource === 'all' ? items : items.filter(i => i.source === activeSource);

  const getSourceMeta = (sourceId: string) =>
    COMMUNITY_SOURCES.find(s => s.id === sourceId);

  return (
    <Card>
      <CardHeader title="글로벌 트렌딩" icon="trending" />
      <CardDivider />

      <div className="space-y-1.5 px-3 py-2.5">
        <div className="scrollbar-hide fade-edge-r flex gap-1 overflow-x-auto">
          {REGION_FILTERS.map(r => (
            <Chip
              key={r.id}
              active={activeRegion === r.id}
              onClick={() => setActiveRegion(r.id)}
            >
              <span className="mr-1">{r.flag}</span>
              {r.label}
            </Chip>
          ))}
        </div>
        <div className="scrollbar-hide fade-edge-r flex gap-1 overflow-x-auto">
          {sourceTabs.map(tab => (
            <Chip
              key={tab.id}
              active={activeSource === tab.id}
              onClick={() => setActiveSource(tab.id)}
            >
              {tab.label}
            </Chip>
          ))}
        </div>
      </div>

      <CardDivider />

      <div className="max-h-[26rem] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4 px-5 py-4">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="shimmer space-y-1.5 rounded">
                <div className="h-3.5 w-full rounded bg-fill-weak" />
                <div className="h-2.5 w-1/3 rounded bg-fill-weak" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="t-body-sm px-5 py-10 text-center text-slate-500">
            트렌딩 항목이 없습니다
          </p>
        ) : (
          <ol className="divide-y divide-line">
            {filtered.map((item, index) => {
              const meta = getSourceMeta(item.source);
              return (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-3 px-5 py-3 transition-colors hover:bg-fill-subtle"
                  >
                    {/* 순위는 세리프 숫자로 — 목록 제목과 성격이 갈린다 */}
                    <span
                      aria-hidden
                      className="t-editorial tnum mt-px w-4 flex-shrink-0 text-right t-body font-medium leading-snug text-slate-600"
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="t-body-sm line-clamp-2 font-medium text-slate-200 transition-colors group-hover:text-accent-text">
                        {item.titleKo || item.title}
                      </p>
                      <div className="t-meta-sm mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-normal text-slate-500">
                        {meta && <span className="font-semibold text-slate-400">{meta.nameKo}</span>}
                        {item.score > 0 && (
                          <span className="tnum">{formatNumber(item.score)}점</span>
                        )}
                        {item.commentCount !== undefined && item.commentCount > 0 && (
                          <span className="tnum">댓글 {formatNumber(item.commentCount)}</span>
                        )}
                        {item.subreddit && <span>r/{item.subreddit}</span>}
                        <span className="tnum">{formatRelativeTime(item.publishedAt)}</span>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </Card>
  );
}
