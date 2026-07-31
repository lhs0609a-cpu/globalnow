'use client';

import { useState, useEffect, useMemo } from 'react';
import { TrendingItem } from '@/types/news';
import { COMMUNITY_SOURCES, REGION_FILTERS, getSourcesByRegion } from '@/lib/constants/communities';
import { formatNumber } from '@/lib/utils/format';
import { formatRelativeTime } from '@/lib/utils/date';

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

  // Reset source when region changes
  useEffect(() => {
    setActiveSource('all');
  }, [activeRegion]);

  const filtered = activeSource === 'all'
    ? items
    : items.filter(i => i.source === activeSource);

  const getSourceMeta = (sourceId: string) =>
    COMMUNITY_SOURCES.find(s => s.id === sourceId);

  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <span>🔥</span> 글로벌 트렌딩
        </h3>
      </div>

      {/* Region filters */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-2">
        {REGION_FILTERS.map(r => (
          <button
            key={r.id}
            onClick={() => setActiveRegion(r.id)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeRegion === r.id
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <span className="mr-1">{r.flag}</span>
            {r.label}
          </button>
        ))}
      </div>

      {/* Source tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-3">
        {sourceTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSource(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeSource === tab.id
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">트렌딩 항목이 없습니다</p>
        ) : (
          filtered.map((item, index) => {
            const meta = getSourceMeta(item.source);
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <span className="text-slate-500 text-xs font-mono w-5 text-right flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.titleKo || item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    {meta && (
                      <span className="flex items-center gap-0.5">
                        <span>{meta.regionFlag}</span>
                        <span>{meta.icon}</span>
                        <span>{meta.nameKo}</span>
                      </span>
                    )}
                    {item.score > 0 && <span>{formatNumber(item.score)} 점</span>}
                    {item.commentCount !== undefined && item.commentCount > 0 && (
                      <span>{formatNumber(item.commentCount)} 댓글</span>
                    )}
                    {item.subreddit && <span>r/{item.subreddit}</span>}
                    <span>{formatRelativeTime(item.publishedAt)}</span>
                  </div>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
