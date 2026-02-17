'use client';

import { useState, useEffect } from 'react';
import { TrendingItem } from '@/types/news';
import { Tabs } from '@/components/ui/Tabs';
import { formatNumber } from '@/lib/utils/format';
import { formatRelativeTime } from '@/lib/utils/date';

const sourceTabs = [
  { id: 'all', label: '전체' },
  { id: 'hackernews', label: 'HN', icon: '🔶' },
  { id: 'producthunt', label: 'PH', icon: '🚀' },
  { id: 'reddit', label: 'Reddit', icon: '🤖' },
  { id: 'github', label: 'GitHub', icon: '😙' },
];

export function TrendingBar() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [activeSource, setActiveSource] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/trends');
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrending();
  }, []);

  const filtered = activeSource === 'all' 
    ? items 
    : items.filter(i => i.source === activeSource);

  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <span>🔥</span> 트랜딩
        </h3>
      </div>
      
      <Tabs
        tabs={sourceTabs}
        activeTab={activeSource}
        onChange={setActiveSource}
        className="mb-3"
      />

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">트렌딩 항목이 없습니다</p>
        ) : (
          filtered.map((item, index) => (
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
                  <span>{formatNumber(item.score)} 점</span>
                  {item.commentCount && <span>{formatNumber(item.commentCount)} 댓글</span>}
                  {item.subreddit && <span>r/{item.subreddit}</span>}
                  <span>{formatRelativeTime(item.publishedAt)}</span>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
